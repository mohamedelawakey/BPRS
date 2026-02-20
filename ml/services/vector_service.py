from backend.app.core.logging import get_logger
from ml.services.postgres_pool import MLPostgresConnectionPool
from typing import List, Union
from ml.Enum.Enumerations import Enumerations
import numpy as np

logger = get_logger(__name__, system_type='ml')


class VectorService:
    @staticmethod
    def search_similar_books(
        query_embedding: Union[List[float], np.ndarray],
        top_k=Enumerations.top_k
    ):
        if query_embedding is None or len(query_embedding) == 0:
            return []

        if isinstance(query_embedding, np.ndarray):
            query_embedding = query_embedding.tolist()

        vector_str = '[' + ','.join(map(str, query_embedding)) + ']'

        try:
            with MLPostgresConnectionPool.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(Enumerations.ef_search)
                    cursor.execute(
                        Enumerations.vector_service_query,
                        (vector_str, vector_str, top_k)
                    )

                    results = cursor.fetchall()

            logger.info(f'VectorService: found {len(results)} similar books')

            return [
                {'book_id': r[0], 'similarity': float(r[1])}
                for r in results
            ]
        except Exception as e:
            logger.error(f'VectorService error: {e}', exc_info=True)
            return []
