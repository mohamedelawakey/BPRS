from ml.reranking.reranking import Reranker
from ml.Enum.Enumerations import Enumerations


def test_reranker_empty_input():
    result = Reranker.reranker([])
    assert result == []


def test_reranker_sorting_logic(mocker):
    mocker.patch.object(Enumerations, 'weight_similarity', 0.5)
    mocker.patch.object(Enumerations, 'weight_weighted_rating', 0.5)
    mocker.patch.object(Enumerations, 'weight_counts_of_review', 0.0)
    mocker.patch.object(Enumerations, 'weight_tech_score', 0.0)
    mocker.patch.object(Enumerations, 'weight_publishyear', 0.0)
    mocker.patch.object(Enumerations, 'weight_average_low', 0.0)

    books = [
        {"book_id": 1, "similarity": 1.0, "weighted_rating": 0.0, "counts_of_review_scaled": 0, "tech_score_scaled": 0, "publishyear_scaled": 0, "average_low_rating": 0},
        {"book_id": 2, "similarity": 0.0, "weighted_rating": 1.0, "counts_of_review_scaled": 0, "tech_score_scaled": 0, "publishyear_scaled": 0, "average_low_rating": 0},
        {"book_id": 3, "similarity": 1.0, "weighted_rating": 1.0, "counts_of_review_scaled": 0, "tech_score_scaled": 0, "publishyear_scaled": 0, "average_low_rating": 0},
    ]

    result = Reranker.reranker(books, top_k=3)

    assert len(result) == 3
    assert result[0]["book_id"] == 3
    assert "rerank_score" in result[0]
    assert result[0]["rerank_score"] == 1.0


def test_reranker_missing_columns():
    books = [
        {"book_id": 4, "similarity": 0.8}
    ]
    result = Reranker.reranker(books)

    assert len(result) == 1
    assert result[0]["weighted_rating"] == 0.0
    assert "rerank_score" in result[0]
