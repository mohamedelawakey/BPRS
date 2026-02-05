from backend.app.core.logging import get_logger
from ml.Enum.Enumerations import Enumerations
from typing import Any, List, Dict
import pandas as pd

logger = get_logger(__name__, system_type='ml')


class Reranker:
    @staticmethod
    def reranker(
        books: List[Dict[str, Any]],
        top_k: int = Enumerations.top_k_rerank
    ) -> List[Dict[str, Any]]:

        if not books:
            logger.warning("Reranker: empty books list")
            return []

        try:
            data = pd.DataFrame(books)

            required_columns = [
                "similarity",
                "weighted_rating",
                "counts_of_review_scaled",
                "tech_score_scaled",
                "publishyear_scaled",
                "average_low_rating"
            ]

            for col in required_columns:
                if col not in data.columns:
                    data[col] = 0.0

            data[required_columns] = data[required_columns].fillna(0.0)

            data['rerank_score'] = (
                0.5 * data["similarity"] +
                0.2 * data["weighted_rating"] +
                0.15 * data["counts_of_review_scaled"] +
                0.05 * data["tech_score_scaled"] +
                0.05 * data["publishyear_scaled"] -
                0.05 * data["average_low_rating"]
            )

            data = data.sort_values('rerank_score', ascending=False)

            logger.info(f"Reranker: reranked {len(data)} books, returning top {top_k}")
            return data.to_dict(orient='records')[:top_k]

        except Exception as e:
            logger.error(f"Reranker error: {e}", exc_info=True)
            return []
