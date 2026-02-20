import asyncpg
import asyncio
from backend.app.core.logging import get_logger
from contextlib import asynccontextmanager
from backend.app.core.config import (
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT
)
from backend.app.enum.enumerations import Enumerations

logger = get_logger(__name__, system_type='backend')


class PostgresDBConnection:
    _pool = None
    _lock = None

    @classmethod
    async def init_pool(cls):
        if cls._lock is None:
            cls._lock = asyncio.Lock()

        if cls._pool is None:
            async with cls._lock:
                if cls._pool is None:
                    try:
                        cls._pool = await asyncpg.create_pool(
                            user=DB_USER,
                            password=DB_PASSWORD,
                            database=DB_NAME,
                            host=DB_HOST,
                            port=DB_PORT,
                            min_size=Enumerations.min_connections,
                            max_size=Enumerations.max_connections,
                        )
                        logger.info("Async PostgreSQL connection pool initialized")
                    except Exception as e:
                        logger.error(f"Error initializing Async PostgreSQL connection pool: {e}")
                        raise

    @classmethod
    async def close_pool(cls):
        if cls._pool:
            await cls._pool.close()
            logger.info("Async PostgreSQL connection pool closed")

    @classmethod
    @asynccontextmanager
    async def get_db_connection(cls):
        if cls._pool is None:
            await cls.init_pool()

        async with cls._pool.acquire() as conn:
            async with conn.transaction():
                yield conn
