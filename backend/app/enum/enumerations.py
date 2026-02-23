from dotenv import load_dotenv
import os

load_dotenv()

KEY_PREFIX = os.getenv("KEY_PREFIX", "rate_limit")
CACHE_PREFIX = os.getenv("CACHE_PREFIX", "search")

RETRIES = int(float(os.getenv('RETRIES', 3)))
RETRY_DELAY = int(float(os.getenv('RETRY_DELAY', 3)))
MAX_CONNECTIONS = int(float(os.getenv('MAX_CONNECTIONS', 20)))
MIN_CONNECTIONS = int(float(os.getenv('MIN_CONNECTIONS', 1)))
LIMIT = int(float(os.getenv("LIMIT", 5)))
WINDOW_SECOND = int(float(os.getenv("WINDOW_SECOND", 60)))
CACHE_TTL = int(float(os.getenv("EXPIRE", 3600)))
CLEAR_ALL_COUNTER = int(os.getenv("CLEAR_ALL_COUNTER", 100))
SEARCH_REQUEST_MAX_LENGTH = int(os.getenv("SEARCH_REQUEST_MAX_LENGTH", 255))
SEARCH_REQUEST_MIN_LENGTH = int(os.getenv("SEARCH_REQUEST_MIN_LENGTH", 1))

TOP_K_GREAT_THAN_OR_EQUAL = int(os.getenv("TOP_K_GREAT_THAN_OR_EQUAL", 1))
TOP_K_LESS_THAN_OR_EQUAL = int(os.getenv("TOP_K_LESS_THAN_OR_EQUAL", 10000))

RERANK_TOP_K_GREAT_THAN_OR_EQUAL = int(os.getenv("RERANK_TOP_K_GREAT_THAN_OR_EQUAL", 1))
RERANK_TOP_K_LESS_THAN_OR_EQUAL = int(os.getenv("RERANK_TOP_K_LESS_THAN_OR_EQUAL", 120))

TOP_K_RERANK = int(os.getenv("TOP_K_RERANK", 50))
TOP_K = int(os.getenv("TOP_K", 100))

SECRET_KEY = os.getenv("SECRET_KEY", "")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
HARD_CODED_HOST = os.getenv("HARD_CODED_HOST", "127.0.0.1")
BLOCK_USER_MINUTES = int(os.getenv("BLOCK_USER_MINUTES", 15))


class Enumerations:
    # Redis
    retries = RETRIES
    retry_delay = RETRY_DELAY

    # max connections
    min_connections = MIN_CONNECTIONS
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

    # security
    secret_key = SECRET_KEY
    algorithm = ALGORITHM
    access_token_expire_minutes = ACCESS_TOKEN_EXPIRE_MINUTES
    refresh_token_expire_days = REFRESH_TOKEN_EXPIRE_DAYS
    hard_coded_host = HARD_CODED_HOST
    block_user_minutes = BLOCK_USER_MINUTES

    # search defaults
    top_k_rerank = TOP_K_RERANK
    top_k = TOP_K

    # roles
    class Role:
        admin = "admin"
        user = "user"

    # DB auth queries
    create_session_query = """
            INSERT INTO user_sessions (user_id, refresh_jti, expires_at, device_info)
            VALUES ($1, $2, $3, $4)
        """
    get_session_query = "SELECT * FROM user_sessions WHERE refresh_jti = $1"
    revoke_session_query = "UPDATE user_sessions SET is_revoked = TRUE WHERE refresh_jti = $1"
    revoke_all_sessions_query = "UPDATE user_sessions SET is_revoked = TRUE WHERE user_id = $1"
