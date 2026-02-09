from backend.app.core.logging import get_logger
from backend.app.db.redis import AsyncRedisDBConnection
from fastapi import HTTPException, Request, status
from backend.app.enum.enumerations import Enumerations

logger = get_logger(__name__, system_type="backend")


class RateLimiter:
    def __init__(
        self,
        limit: int = Enumerations.limit,
        window_seconds: int = Enumerations.window_seconds,
        key_prefix: str = Enumerations.key_prefix
    ):
        self.limit = limit
        self.window = window_seconds
        self.key_prefix = key_prefix

    async def _get_key(self, request: Request) -> str:
        user_id = getattr(request.state, "user_id", None)

        if user_id:
            return f"{self.key_prefix}:user:{user_id}"

        client_ip = request.client.host if request.client else "unknown"
        return f"{self.key_prefix}:ip:{client_ip}"

    async def __call__(self, request: Request):
        try:
            redis = await AsyncRedisDBConnection.get_connection()
            key = await self._get_key(request)

            current = await redis.incr(key)

            if current == 1:
                await redis.expire(key, self.window)

            if current > self.limit:
                ttl = await redis.ttl(key)
                logger.warning(
                    f"Rate limit exceeded for key={key} count={current}"
                )

                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail={
                        "message": "too many requests",
                         "retry_after_seconds": ttl
                    }
                )
        except HTTPException:
            raise

        except Exception as e:
            logger.error(f"Rate limiter error: {e}", exc_info=True)

            return
