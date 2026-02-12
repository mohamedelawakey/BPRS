from typing import Any, Dict, List
from ml.Enum.Enumerations import Enumerations
from backend.app.core.logging import get_logger
from backend.app.db.postgres import PostgresDBConnection

logger = get_logger(__name__, system_type='ml')


class MetadataService:
    @staticmethod
    def get_books_metadata(
        book_ids: List[int]
    ) -> List[Dict[str, Any]]:
        if not book_ids:
            logger.warning("MetaDataService: empty book_ids list provided")
            return []

        try:
            with PostgresDBConnection.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    query = Enumerations.metadata_service_query

                    cursor.execute(query, (book_ids, ))
                    results = cursor.fetchall()

            books = [
                dict(result) for result in results
            ]

            logger.info(f"MetaDataService: retrieved metadata for {len(books)} books")
            return books

        except Exception as e:
            logger.error(f"MetaDataService error: {e}", exc_info=True)
            return []
