import pytest
from ml.services.vector_service import VectorService
from ml.services.metadata_service import MetadataService
from ml.pipeline.v1.embed import Embedder


@pytest.mark.integration
def test_db_services_integration():
    embed_result = Embedder.embedder("machine learning")
    query_embedding = embed_result.get("name_embeddings")

    assert query_embedding is not None, "Failed to generate embedding"
    assert len(query_embedding) > 0, "Embedding is empty"

    vector_results = VectorService.search_similar_books(query_embedding, top_k=5)

    assert vector_results is not None, "Vector search returned None"

    if len(vector_results) == 0:
        pytest.skip("No books found in the test database. Skipping integration test.")

    assert len(vector_results) <= 5, "Returned more results than top_k"
    assert 'book_id' in vector_results[0], "Result missing book_id constraint"
    assert 'similarity' in vector_results[0], "Result missing similarity constraint"

    book_ids = [item['book_id'] for item in vector_results]
    metadata_results = MetadataService.get_books_metadata(book_ids)

    assert len(metadata_results) == len(book_ids), "Metadata count mismatch with Vector count"
    assert 'name' in metadata_results[0], "Metadata missing standard book columns"
