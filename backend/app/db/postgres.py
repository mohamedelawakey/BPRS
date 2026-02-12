from backend.app.core.logging import get_logger
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
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

    @classmethod
    def init_pool(cls):
        if cls._pool is None:
            try:
                cls._pool = pool.SimpleConnectionPool(
                    dbname=DB_NAME,
                    user=DB_USER,
                    password=DB_PASSWORD,
                    host=DB_HOST,
                    port=DB_PORT,
                    cursor_factory=RealDictCursor,
                    minconn=Enumerations.min_connections,
                    maxconn=Enumerations.max_connections,
                )
                logger.info("PostgreSQL connection pool initialized")
            except Exception as e:
                logger.error(f"Error initializing PostgreSQL connection pool: {e}")
                raise

    @classmethod
    def close_pool(cls):
        if cls._pool:
            cls._pool.closeall()
            logger.info("PostgreSQL connection pool closed")

    @staticmethod
    def get_pg_connection():
        if PostgresDBConnection._pool is None:
            PostgresDBConnection.init_pool()

        try:
            return PostgresDBConnection._pool.getconn()
        except Exception as e:
            logger.error(f"Error getting connection from pool: {e}")
            raise

    @staticmethod
    def release_connection(conn):
        if PostgresDBConnection._pool and conn:
            PostgresDBConnection._pool.putconn(conn)

    @staticmethod
    @contextmanager
    def get_db_connection():
        conn = PostgresDBConnection.get_pg_connection()
        try:
            yield conn
        finally:
            PostgresDBConnection.release_connection(conn)
