from fastapi import APIRouter, HTTPException, status
from .service import SearchService
from .schemas import SearchRequest, SearchResponse
from backend.app.core.logging import get_logger


router = APIRouter(prefix="/search", tags=["search"])
logger = get_logger(__name__, system_type="backend")


@router.post("/", response_model=SearchResponse)
async def search(request: SearchRequest):
    try:
        logger.info(f"Search request: '{request.query}' (top_k={request.top_k}, rerank={request.apply_rerank})")

        results, total_found = await SearchService.search(
            query=request.query,
            top_k=request.top_k,
            apply_rerank=request.apply_rerank,
            rerank_top_k=request.rerank_top_k
        )

        print(f"API Search returned {len(results)} results (out of {total_found}) for top_k={request.top_k} rerank_top_k={request.rerank_top_k}")

        return SearchResponse(
            success=True,
            query=request.query,
            total_results=total_found,
            results=results
        )

    except Exception as e:
        logger.error(f"Search endpoint error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )
