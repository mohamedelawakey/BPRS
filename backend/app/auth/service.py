from backend.app.db.postgres import PostgresDBConnection
from backend.app.db.redis import AsyncRedisDBConnection
from backend.app.enum.enumerations import Enumerations
from backend.app.core.hashing import verify_password
from backend.app.users.service import UserService
from backend.app.core.logging import get_logger
from fastapi import HTTPException, status
from .schemas import UserSession
from datetime import datetime
from typing import Optional
from backend.app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_token,
    blacklist_token,
    block_user
)

logger = get_logger(__name__)


class AuthService:
    @staticmethod
    async def authenticate_user(
        username: str,
        password: str,
        ip: str,
        ua: str
    ) -> dict:
        user = await UserService.get_by_email(username)

        if not user:
            logger.warning("Login failed: User not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not verify_password(password, user.hashed_password):
            logger.warning(
                f"Login failed: Incorrect password for user {user.id}"
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            logger.warning(f"Login failed: User {user.id} is inactive")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Inactive user"
            )

        access_token = create_access_token(
            user.id,
            user.role,
            ip=ip,
            ua=ua
        )
        refresh_token = await create_refresh_token(user.id)

        logger.info(f"User {user.id} logged in successfully")

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    @staticmethod
    async def refresh_user_tokens(token: str, ip: str, ua: str) -> dict:
        payload = await verify_token(token, expected_type="refresh")

        jti = payload.get("jti")
        user_id = payload.get("sub")
        exp = int(payload.get("exp"))

        redis = await AsyncRedisDBConnection.get_connection()

        whitelist_key = f"user_refresh:{user_id}:{jti}"
        exists = await redis.exists(whitelist_key)

        if not exists:
            logger.critical(f"SECURITY ALERT: Refresh token reuse detected for user {user_id}. JTI: {jti}")
            await block_user(user_id)
            await blacklist_token(jti, exp)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token (Reuse detected)"
            )

        await redis.delete(whitelist_key)

        user = await UserService.get_by_id(user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User inactive or not found"
            )

        new_access_token = create_access_token(
            user.id,
            user.role,
            ip=ip,
            ua=ua
        )
        new_refresh_token = await create_refresh_token(user.id)

        logger.info(f"Token refreshed and rotated for user {user.id}")

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }


class SessionService:
    @staticmethod
    async def create_session(
        user_id: str,
        refresh_jti: str,
        expires_at: datetime,
        device_info: str = None
    ):
        query = Enumerations.create_session_query
        async with PostgresDBConnection.get_db_connection() as conn:
            await conn.execute(
                query,
                user_id,
                refresh_jti,
                expires_at,
                device_info
            )

    @staticmethod
    async def get_session(refresh_jti: str) -> Optional[UserSession]:
        query = Enumerations.get_session_query
        async with PostgresDBConnection.get_db_connection() as conn:
            result = await conn.fetchrow(query, refresh_jti)
            if result:
                return UserSession(
                    id=str(result['id']),
                    user_id=str(result['user_id']),
                    refresh_jti=result['refresh_jti'],
                    is_revoked=result['is_revoked'],
                    created_at=result['created_at'],
                    expires_at=result['expires_at'],
                    device_info=result['device_info']
                )
        return None

    @staticmethod
    async def revoke_session(refresh_jti: str):
        query = Enumerations.revoke_session_query
        async with PostgresDBConnection.get_db_connection() as conn:
            await conn.execute(query, refresh_jti)

    @staticmethod
    async def revoke_all_sessions(user_id: str):
        logger.warning(f"SECURITY ALERT: Revoking ALL sessions for user {user_id}")
        query = Enumerations.revoke_all_sessions_query
        async with PostgresDBConnection.get_db_connection() as conn:
            await conn.execute(query, user_id)
