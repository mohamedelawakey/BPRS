from dotenv import load_dotenv
import os

load_dotenv()

RETRIES = int(os.getenv('RETRIES', 3))
RETRY_DELAY = int(os.getenv('RETRY_DELAY', 3))
MAX_CONNECTIONS = int(os.getenv('MAX_CONNECTIONS', 10))
LIMIT = int(os.getenv("LIMIT", 30))
WINDOW_SECOND = int(os.getenv("WINDOW_SECOND", 60))
KEY_PREFIX = os.getenv("KEY_PREFIX", "rate_limit")


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
