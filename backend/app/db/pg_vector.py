from backend.app.core.logging import get_logger
from backend.app.db.postgres import PostgresDBConnection

from contextlib import asynccontextmanager

logger = get_logger(__name__, system_type='backend')


class PGVectorDBConnection:
    @staticmethod
    @asynccontextmanager
    async def get_pgvector_connection():
        try:
            logger.info('connection successfully')
            async with PostgresDBConnection.get_db_connection() as conn:
                yield conn
        except Exception as e:
            logger.error(f'connection error: {e}')
            raise
