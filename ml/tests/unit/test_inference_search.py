from ml.inference.search import Search


def test_search_empty_text():
    result = Search.search("")
    assert result == []


def test_search_no_embedding(mocker):
    mocker.patch('ml.inference.search.Embedder.embedder', return_value={"name_embeddings": []})
    result = Search.search("Test")
    assert result == []


def test_search_no_vector_results(mocker):
    mocker.patch('ml.inference.search.Embedder.embedder', return_value={"name_embeddings": [0.1, 0.2]})
    mocker.patch('ml.inference.search.VectorService.search_similar_books', return_value=[])

    result = Search.search("Test")
    assert result == []


def test_search_success(mocker):
    mocker.patch('ml.inference.search.Embedder.embedder', return_value={"name_embeddings": [0.1, 0.2]})
    mocker.patch('ml.inference.search.VectorService.search_similar_books', return_value=[
        {"book_id": 1, "similarity": 0.9},
        {"book_id": 2, "similarity": 0.8}
    ])
    mocker.patch('ml.inference.search.MetadataService.get_books_metadata', return_value=[
        {"book_id": 1, "name": "Book 1"},
        {"book_id": 2, "name": "Book 2"}
    ])

    result = Search.search("Test")

    assert len(result) == 2

    book_1 = next(b for b in result if b["book_id"] == 1)
    book_2 = next(b for b in result if b["book_id"] == 2)

    assert book_1["similarity"] == 0.9
    assert book_2["similarity"] == 0.8


def test_search_exception(mocker):
    mocker.patch('ml.inference.search.Embedder.embedder', side_effect=Exception("Search Error"))
    result = Search.search("Test")
    assert result == []
