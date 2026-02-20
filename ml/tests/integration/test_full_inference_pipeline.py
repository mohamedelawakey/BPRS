import pytest
from ml.inference.search import Search
from ml.reranking.reranking import Reranker


@pytest.mark.integration
def test_full_inference_pipeline():

    search_results = Search.search("python programming for beginners", top_k=10)

    if not search_results:
        pytest.skip("No books found in the test database. Skipping E2E test.")

    assert len(search_results) > 0, "No results returned for a generic search query"
    assert 'book_id' in search_results[0], "Missing book_id"
    assert 'similarity' in search_results[0], "Similarity value not mapped back from VectorService into MetadataService"
    assert 'name' in search_results[0], "Missing book name"

    reranked_results = Reranker.reranker(search_results, top_k=5)

    assert len(reranked_results) <= 5, "Reranker returned more than top_k"
    assert 'rerank_score' in reranked_results[0], "Reranker mathematics failed to produce score"

    if len(reranked_results) > 1:
        assert reranked_results[0]['rerank_score'] >= reranked_results[1]['rerank_score'], "Rerank sorting failed"
