from ml.services.postgres_pool import MLPostgresConnectionPool
from unittest.mock import MagicMock


def test_pool_initialization(mocker):
    mock_pool_cls = mocker.patch('psycopg2.pool.ThreadedConnectionPool')
    mock_pool_instance = MagicMock()
    mock_pool_cls.return_value = mock_pool_instance

    MLPostgresConnectionPool._pool = None

    pool = MLPostgresConnectionPool.get_pool()
    assert pool is mock_pool_instance
    mock_pool_cls.assert_called_once()


def test_pool_context_manager(mocker):
    mock_pool = MagicMock()
    mock_conn = MagicMock()
    mock_pool.getconn.return_value = mock_conn

    mocker.patch.object(MLPostgresConnectionPool, 'get_pool', return_value=mock_pool)

    with MLPostgresConnectionPool.get_connection() as conn:
        assert conn is mock_conn

    mock_pool.getconn.assert_called_once()
    mock_pool.putconn.assert_called_once_with(mock_conn)
