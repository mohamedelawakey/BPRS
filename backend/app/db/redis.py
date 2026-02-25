from backend.app.core.logging import get_logger
from backend.app.core.config import (
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    REDIS_DB
)
import asyncio
from redis.exceptions import RedisError, ConnectionError
from redis.asyncio import Redis, ConnectionPool
from backend.app.enum.enumerations import Enumerations

logger = get_logger(__name__, system_type="backend")


class AsyncRedisDBConnection:
    _instance: Redis | None = None
    _pool: ConnectionPool | None = None
    _lock: asyncio.Lock | None = None

    @staticmethod
    async def get_connection(
        retries: int = Enumerations.retries,
        retry_delay: float = Enumerations.retry_delay
    ) -> Redis:
        if AsyncRedisDBConnection._lock is None:
            AsyncRedisDBConnection._lock = asyncio.Lock()

        if AsyncRedisDBConnection._instance:
            return AsyncRedisDBConnection._instance

        async with AsyncRedisDBConnection._lock:
            if AsyncRedisDBConnection._instance:
                return AsyncRedisDBConnection._instance

            try:
                if AsyncRedisDBConnection._pool is None:
                    AsyncRedisDBConnection._pool = ConnectionPool(
                        host=REDIS_HOST,
                        port=REDIS_PORT,
                        db=REDIS_DB,
                        password=REDIS_PASSWORD,
                        decode_responses=True,
                        max_connections=Enumerations.max_connections,
                        retry_on_timeout=True
                    )

                attempt = 0
                while attempt < retries:
                    try:
                        redis = Redis(
                            connection_pool=AsyncRedisDBConnection._pool
                        )
                        await redis.ping()

                        AsyncRedisDBConnection._instance = redis
                        logger.info("Connected to Redis (async) successfully")

                        return redis

                    except (RedisError, ConnectionError) as e:
                        attempt += 1
                        logger.warning(
                            f"Async Redis connection attempt {attempt}/{retries} failed: {e}"
                        )
                        await asyncio.sleep(retry_delay)

                raise ConnectionError(
                    f"Failed to connect to Redis after {retries} attempts"
                )

            except Exception as e:
                logger.error(
                    f"Async Redis connection fatal error: {e}", exc_info=True
                )
                raise
