from ml.services.vector_service import VectorService


def test_search_similar_books_empty_query():
    result = VectorService.search_similar_books([])
    assert result == []

    result = VectorService.search_similar_books(None)
    assert result == []


def test_search_similar_books_success(mocker):
    mock_conn = mocker.MagicMock()
    mock_cursor = mocker.MagicMock()

    mock_cursor.fetchall.return_value = [
        (101, 0.95),
        (202, 0.82)
    ]

    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

    mocker.patch('ml.services.vector_service.MLPostgresConnectionPool.get_connection', 
                 mocker.MagicMock(return_value=mocker.MagicMock(__enter__=mocker.MagicMock(return_value=mock_conn))))

    query = [0.1, 0.2, 0.3]
    result = VectorService.search_similar_books(query, top_k=2)

    assert len(result) == 2
    assert result[0] == {'book_id': 101, 'similarity': 0.95}
    assert result[1] == {'book_id': 202, 'similarity': 0.82}
    assert mock_cursor.execute.call_count == 2


def test_search_similar_books_db_error(mocker):
    mocker.patch('ml.services.vector_service.MLPostgresConnectionPool.get_connection', side_effect=Exception("DB Error"))

    result = VectorService.search_similar_books([0.1, 0.2])
    assert result == []
