from dotenv import load_dotenv
import os

load_dotenv()

KEY_PREFIX = os.getenv("KEY_PREFIX", "rate_limit")
CACHE_PREFIX = os.getenv("CACHE_PREFIX", "search")

RETRIES = int(os.getenv('RETRIES', 3))
RETRY_DELAY = int(os.getenv('RETRY_DELAY', 3))
MAX_CONNECTIONS = int(os.getenv('MAX_CONNECTIONS', 10))
LIMIT = int(os.getenv("LIMIT", 30))
WINDOW_SECOND = int(os.getenv("WINDOW_SECOND", 60))
CACHE_TTL = int(os.getenv("EXPIRE", 3600))
CLEAR_ALL_COUNTER = int(os.getenv("CLEAR_ALL_COUNTER", 100))
SEARCH_REQUEST_MAX_LENGTH = int(os.getenv("SEARCH_REQUEST_MAX_LENGTH", 255))
SEARCH_REQUEST_MIN_LENGTH = int(os.getenv("SEARCH_REQUEST_MIN_LENGTH", 1))
TOP_K_GREAT_THAN_OR_EQUAL = int(os.getenv("TOP_K_GREAT_THAN_OR_EQUAL", 1))
RERANK_TOP_K_GREAT_THAN_OR_EQUAL = int(os.getenv("RERANK_TOP_K_GREAT_THAN_OR_EQUAL", 1))
TOP_K_LESS_THAN_OR_EQUAL = int(os.getenv("TOP_K_LESS_THAN_EQUAL", 220))
RERANK_TOP_K_LESS_THAN_OR_EQUAL = int(os.getenv("TOP_K_LESS_THAN_EQUAL", 120))


class Enumerations:
    # Redis
    retries = RETRIES
    retry_delay = RETRY_DELAY

    # max connections
    max_connections = MAX_CONNECTIONS

    # rate limit
    limit = LIMIT
    window_seconds = WINDOW_SECOND
    key_prefix = KEY_PREFIX

    # Caching
    cache_ttl = CACHE_TTL
    cache_prefix = CACHE_PREFIX
    clear_all_counter = CLEAR_ALL_COUNTER

    # schema configurations
    search_request_min_length = SEARCH_REQUEST_MIN_LENGTH
    search_request_max_length = SEARCH_REQUEST_MAX_LENGTH
    top_k_greater_than_or_equal = TOP_K_GREAT_THAN_OR_EQUAL
    rerank_top_k_greater_than_or_equal = RERANK_TOP_K_GREAT_THAN_OR_EQUAL
    top_k_less_than_or_equal = TOP_K_LESS_THAN_OR_EQUAL
    rerank_top_k_less_than_or_equal = RERANK_TOP_K_LESS_THAN_OR_EQUAL
