from backend.app.core.logging import get_logger
from backend.app.core.config import (
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT
)
import psycopg2
from psycopg2.extras import RealDictCursor

logger = get_logger(__name__, system_type='backend')


class PostgresDBConnection:
    @staticmethod
    def get_pg_connection():
        try:
            conn = psycopg2.connect(
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                host=DB_HOST,
                port=DB_PORT,
                cursor_factory=RealDictCursor
            )

            logger.info('connection to PostgreSQL database successfully')
            return conn
        except Exception as e:
            logger.error(f'Postgres connection error: {e}')
            raise
