from ml.services.metadata_service import MetadataService


def test_get_books_metadata_empty_input():
    assert MetadataService.get_books_metadata([]) == []
    assert MetadataService.get_books_metadata(None) == []


def test_get_books_metadata_success(mocker):
    mock_conn = mocker.MagicMock()
    mock_cursor = mocker.MagicMock()

    mock_cursor.fetchall.return_value = [
        {'book_id': 101, 'name': 'Book A'},
        {'book_id': 202, 'name': 'Book B'}
    ]

    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
    mocker.patch('ml.services.metadata_service.MLPostgresConnectionPool.get_connection', 
                 mocker.MagicMock(return_value=mocker.MagicMock(__enter__=mocker.MagicMock(return_value=mock_conn))))

    result = MetadataService.get_books_metadata([101, 202])

    assert len(result) == 2
    assert result[0]['name'] == 'Book A'
    assert result[1]['name'] == 'Book B'
    mock_cursor.execute.assert_called_once()


def test_get_books_metadata_db_error(mocker):
    mocker.patch('ml.services.metadata_service.MLPostgresConnectionPool.get_connection', side_effect=Exception("DB Error"))

    result = MetadataService.get_books_metadata([101])
    assert result == []
