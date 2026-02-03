from backend.app.core.logging import get_logger
from backend.app.db.pg_vector import PGVectorDBConnection
from typing import List, Dict, Any
from ml.Enum.Enumerations import Enumerations

logger = get_logger(__name__, system_type='ml')


class VectorService:
    @staticmethod
    def search_similar_books(
        query_embedding: List[float],
        top_k: int = Enumerations.top_k
    ) -> List[Dict[str, Any]]:

        try:
            if not query_embedding:
                logger.warning("VectorService: empty query_embedding provided")
                return []

            with PGVectorDBConnection.get_pgvector_connection() as conn:
                with conn.cursor() as cursor:
                    query = Enumerations.vector_service_query

                    cursor.execute(query, (query_embedding, query_embedding, top_k))
                    results = cursor.fetchall()

            books = [
                {
                    'book_id': result['book_id'],
                    'similarity': result['similarity'],
                } for result in results
            ]

            logger.info(f"VectorService: found {len(books)} similar books")
            return books
        except Exception as e:
            logger.error(f"VectorService error: {e}", exc_info=True)
            return []
