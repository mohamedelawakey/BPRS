from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Any
from backend.app.enum.enumerations import Enumerations
from ml.Enum.Enumerations import Enumerations as ml_enum


class SearchRequest(BaseModel):
    query: str = Field(
        min_length=Enumerations.search_request_min_length,
        max_length=Enumerations.search_request_max_length,
        description="The search query text"
    )

    top_k: int = Field(
        default=ml_enum.top_k,
        ge=1,
        le=500,
        description="Number of results to return"
    )

    apply_rerank: bool = Field(
        default=True,
        description="Whether to apply semantic reranking"
    )

    rerank_top_k: int = Field(
        default=ml_enum.top_k_rerank,
        ge=1,
        le=200,
        description="Number of results to rerank"
    )

    @field_validator("query")
    @classmethod
    def validate_query(cls, valid):
        if not valid or not valid.strip():
            raise ValueError("Query cannot be empty or whitespace only")
        return valid.strip()


class SearchResponse(BaseModel):
    success: bool
    query: str
    total_results: int
    results: List[Dict[str, Any]]
