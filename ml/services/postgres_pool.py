import psycopg2
from psycopg2 import pool
from backend.app.core.config import DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER
from ml.Enum.Enumerations import Enumerations
from backend.app.core.logging import get_logger
from contextlib import contextmanager

logger = get_logger(__name__, system_type='ml')


class MLPostgresConnectionPool:
    _pool = None

    @classmethod
    def get_pool(cls):
        if cls._pool is None:
            try:
                cls._pool = psycopg2.pool.ThreadedConnectionPool(
                    minconn=Enumerations.min_connections,
                    maxconn=Enumerations.max_connections,
                    dbname=DB_NAME,
                    user=DB_USER,
                    password=DB_PASSWORD,
                    host=DB_HOST,
                    port=DB_PORT
                )
                logger.info("Synchronous PostgreSQL connection pool initialized for ML services")
            except Exception as e:
                logger.error(f"Error initializing Synchronous PostgreSQL connection pool: {e}")
                raise
        return cls._pool

    @classmethod
    @contextmanager
    def get_connection(cls):
        pool = cls.get_pool()
        conn = pool.getconn()
        try:
            yield conn
        finally:
            pool.putconn(conn)
