from backend.app.core.logging import get_logger
from .cache import CacheManager
from ml.inference.search import Search
from ml.reranking.reranking import Reranker
from ml.Enum.Enumerations import Enumerations
from typing import Dict, List, Any

logger = get_logger(__name__, system_type="backend")


class SearchService:
    @staticmethod
    async def search(
        query: str,
        top_k: int = Enumerations.top_k,
        apply_rerank: bool = True,
        rerank_top_k: int = Enumerations.top_k_rerank
    ) -> List[Dict[str, Any]]:
        if not query or not query.strip():
            logger.warning("Empty query provided")
            return []

        try:
            cached_results = await CacheManager.get(query, top_k)

            if cached_results is not None:
                logger.info(f"Returning cached results for: '{query}'")
                return cached_results

            logger.info(f"Cache miss - calling ML inference for: '{query}'")
            ml_results = Search.search(user_text=query, top_k=top_k)

            if not ml_results:
                logger.warning(f"No results from ML inference for: '{query}'")
                return []

            logger.info(f"ML inference returned {len(ml_results)} results")

            final_results = ml_results

            if apply_rerank and len(ml_results) > 0:
                logger.info(f"Applying reranking to {len(ml_results)} results")
                reranked = Reranker.reranker(ml_results, top_k=rerank_top_k)

                if reranked:
                    final_results = reranked
                    logger.info(f"Reranking complete - returning top {len(final_results)} results")
                else:
                    logger.warning("Reranking failed - using original ML results")

            await CacheManager.set(query, top_k, final_results)
            return final_results

        except Exception as e:
            logger.error(f"Search service error for query '{query}': {e}", exc_info=True)
            return []

    @staticmethod
    async def search_simple(query: str, top_k: int = 20) -> List[Dict[str, Any]]:
        return await SearchService.search(
            query=query,
            top_k=top_k,
            apply_rerank=False
        )

    @staticmethod
    async def invalidate_cache(
        query: str,
        top_k: int = Enumerations.top_k
    ) -> bool:
        try:
            result = await CacheManager.invalidate(query, top_k)
            logger.info(f"Cache invalidated for query: '{query}'")
            return result

        except Exception as e:
            logger.error(f"Cache invalidation error: {e}", exc_info=True)
            return False

    @staticmethod
    async def clear_all_cache() -> bool:
        try:
            result = await CacheManager.clear_all()
            logger.info("All search cache cleared")
            return result

        except Exception as e:
            logger.error(f"Cache clear error: {e}", exc_info=True)
            return False
