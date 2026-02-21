import pytest


@pytest.fixture
def mock_db_connection(mocker):
    mock_conn = mocker.MagicMock()
    mock_cursor = mocker.MagicMock()

    mock_conn.__enter__.return_value = mock_conn
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

    mocker.patch('psycopg2.connect', return_value=mock_conn)

    mock_pool = mocker.MagicMock()
    mock_pool.getconn.return_value = mock_conn
    mocker.patch('psycopg2.pool.ThreadedConnectionPool', return_value=mock_pool)

    return mock_conn, mock_cursor
