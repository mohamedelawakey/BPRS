from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from jose.exceptions import ExpiredSignatureError

from backend.app.enum.enumerations import Enumerations
from backend.app.core.logging import get_logger
from backend.app.db.redis import AsyncRedisDBConnection
from backend.app.users.service import UserService

logger = get_logger(__name__, system_type="backend")

SECRET_KEY = Enumerations.secret_key
ALGORITHM = Enumerations.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = Enumerations.access_token_expire_minutes
REFRESH_TOKEN_EXPIRE_DAYS = Enumerations.refresh_token_expire_days

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_client_ip(request: Request) -> str:
    x_forwarded_for = request.headers.get("x-forwarded-for")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.client.host or Enumerations.hard_coded_host


# TOKEN CREATION
def create_access_token(
    user_id: str,
    role: str,
    ip: str = None,
    ua: str = None
):
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    jti = str(uuid4())

    payload = {
        "sub": user_id,
        "role": role,
        "type": "access",
        "jti": jti,
        "iat": now,
        "nbf": now,
        "exp": expire
    }

    if ip:
        payload["ip"] = ip
    if ua:
        payload["ua"] = ua

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


async def create_refresh_token(user_id: str):
    now = datetime.now(timezone.utc)
    expire = now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    jti = str(uuid4())

    payload = {
        "sub": user_id,
        "type": "refresh",
        "jti": jti,
        "iat": now,
        "nbf": now,
        "exp": expire
    }

    redis = await AsyncRedisDBConnection.get_connection()
    await redis.set(
        f"user_refresh:{user_id}:{jti}",
        user_id,
        ex=REFRESH_TOKEN_EXPIRE_DAYS * 86400
    )

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# BLACKLIST (REDIS)
async def blacklist_token(jti: str, exp_timestamp: int):
    redis = await AsyncRedisDBConnection.get_connection()
    ttl = exp_timestamp - int(datetime.now(timezone.utc).timestamp())

    if ttl > 0:
        await redis.set(f"blacklist:{jti}", "1", ex=ttl)


async def is_jti_blacklisted(jti: str) -> bool:
    redis = await AsyncRedisDBConnection.get_connection()
    exists = await redis.exists(f"blacklist:{jti}")

    return exists == 1


async def block_user(
    user_id: str,
    minutes: int = Enumerations.block_user_minutes
):
    redis = await AsyncRedisDBConnection.get_connection()
    await redis.set(f"user_blocked:{user_id}", "1", ex=minutes * 60)


# VERIFY TOKEN
async def verify_token(
    token: str,
    expected_type: str = "access",
    ip: str = None,
    ua: str = None
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        jti = payload.get("jti")
        if not jti:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token structure"
            )

        if await is_jti_blacklisted(jti):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token revoked"
            )

        if payload.get("type") != expected_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )

        if ip and payload.get("ip") != ip:
            logger.warning(
                f"IP mismatch: Token IP {payload.get('ip')} vs Request IP {ip}"
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="IP mismatch"
            )

        if ua and payload.get("ua") != ua:
            logger.warning(f"User Agent mismatch: {payload.get('ua')} vs {ua}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User Agent mismatch"
            )

        return payload

    except ExpiredSignatureError:
        logger.warning("Token expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except JWTError as e:
        logger.warning(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


# DEPENDENCIES
async def get_current_user(
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    ip = get_client_ip(request)
    ua = request.headers.get("user-agent")
    payload = await verify_token(token, expected_type="access", ip=ip, ua=ua)
    user_id: str = payload.get("sub")

    user = await UserService.get_by_id(user_id)

    redis = await AsyncRedisDBConnection.get_connection()
    is_blocked = await redis.exists(f"user_blocked:{user_id}")

    if is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User temporarily blocked"
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    return user


async def require_admin(user=Depends(get_current_user)):
    if user.role != Enumerations.Role.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins only"
        )

    return user


# LOGOUT
async def logout(token: str = Depends(oauth2_scheme)):
    payload = await verify_token(token, expected_type="access")

    expiration = int(payload.get("exp"))
    jti = payload.get("jti")
    user_id = payload.get("sub")

    if jti:
        await blacklist_token(jti, expiration)

    redis = await AsyncRedisDBConnection.get_connection()

    async for key in redis.scan_iter(f"user_refresh:{user_id}:*"):
        await redis.delete(key)

    return {
        "message": "Logged out successfully"
    }
