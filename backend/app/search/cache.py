from backend.app.core.logging import get_logger
from backend.app.db.redis import AsyncRedisDBConnection
from typing import Any, List, Dict, Optional
from backend.app.enum.enumerations import Enumerations
import json
import hashlib

logger = get_logger(__name__, system_type="backend")


class CacheManager:
    CACHE_TTL = Enumerations.cache_ttl
    CACHE_PREFIX = Enumerations.cache_prefix

    @staticmethod
    def _generate_key(query: str, top_k: int) -> str:
        normalized_query = query.lower().strip()
        raw_key = f"{normalized_query}:{top_k}"
        hash_key = hashlib.md5(raw_key.encode()).hexdigest()
        return f"{CacheManager.CACHE_PREFIX}:{hash_key}"

    @staticmethod
    async def get(query: str, top_k: int) -> Optional[List[Dict[str, Any]]]:
        try:
            redis_client = await AsyncRedisDBConnection.get_connection()
            cache_key = CacheManager._generate_key(query, top_k)

            cached_data = await redis_client.get(cache_key)

            if cached_data:
                logger.info(f"Cache hit for query: '{query}' (top_k={top_k})")
                return json.loads(cached_data)

            logger.info(f"Cache miss for query: '{query}' (top_k={top_k})")
            return None

        except Exception as e:
            logger.warning(f"Cache get error: {e}", exc_info=True)
            return None

    @staticmethod
    async def set(
        query: str,
        top_k: int,
        result: Optional[List[Dict[str, Any]]]
    ) -> bool:
        try:
            redis_client = await AsyncRedisDBConnection.get_connection()
            cache_key = CacheManager._generate_key(query, top_k)

            await redis_client.setex(
                cache_key,
                CacheManager.CACHE_TTL,
                json.dumps(result)
            )

            logger.info(f"Cached results for query: '{query}' (top_k={top_k})")
            return True

        except Exception as e:
            logger.warning(f"Cache set error: {e}", exc_info=True)
            return False

    @staticmethod
    async def invalidate(query: str, top_k: int) -> bool:
        try:
            redis_client = await AsyncRedisDBConnection.get_connection()
            cache_key = CacheManager._generate_key(query, top_k)

            await redis_client.delete(cache_key)
            logger.info(f"Invalidated cache for query: '{query}' (top_k={top_k})")
            return True

        except Exception as e:
            logger.warning(f"Cache invalidate error: {e}", exc_info=True)
            return False

    @staticmethod
    async def clear_all() -> bool:
        try:
            redis_client = await AsyncRedisDBConnection.get_connection()

            pattern = f"{CacheManager.CACHE_PREFIX}:*"
            cursor = 0
            deleted_count = 0

            while True:
                cursor, keys = await redis_client.scan(
                    cursor=cursor,
                    match=pattern,
                    count=Enumerations.clear_all_counter
                )

                if keys:
                    deleted_count += await redis_client.delete(*keys)

                if cursor == 0:
                    break

            logger.info(f"Cleared {deleted_count} cache entries")
            return True

        except Exception as e:
            logger.error(f"Cache clear error: {e}", exc_info=True)
            return False
