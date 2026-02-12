import logging
import os
from logging.handlers import (
    QueueHandler,
    QueueListener
)
import threading
import queue
import atexit
import json_log_formatter
from datetime import datetime
import time

BASE_LOG_DIR = os.path.join(os.getcwd(), "logs")
ML_LOG_DIR = os.path.join(BASE_LOG_DIR, "ml")
BACKEND_LOG_DIR = os.path.join(BASE_LOG_DIR, "backend")
SYSTEM_LOG_DIR = os.path.join(BASE_LOG_DIR, "system")

os.makedirs(ML_LOG_DIR, exist_ok=True)
os.makedirs(BACKEND_LOG_DIR, exist_ok=True)
os.makedirs(SYSTEM_LOG_DIR, exist_ok=True)

log_queue = queue.Queue()
json_formatter = json_log_formatter.JSONFormatter()

listener = None


class SystemLogFilter(logging.Filter):
    def __init__(self, system_type: str):
        super().__init__()
        self.system_type = system_type

    def filter(self, record: logging.LogRecord) -> bool:
        return record.name.endswith(f".{self.system_type}")


def _start_listener():
    global listener
    handlers = {}
    today = datetime.now().strftime("%Y-%m-%d")

    for system_type, dir_path in [
        ('ml', ML_LOG_DIR),
        ('backend', BACKEND_LOG_DIR),
        ('system', SYSTEM_LOG_DIR)
    ]:
        log_file = os.path.join(dir_path, f"{system_type}_{today}.log")
        fh = logging.FileHandler(log_file, encoding="utf-8", delay=True)
        fh.setFormatter(json_formatter)
        fh.addFilter(SystemLogFilter(system_type))
        handlers[system_type] = fh

    listener = QueueListener(
        log_queue,
        *handlers.values(),
        respect_handler_level=True
    )
    listener.start()


threading.Thread(target=_start_listener, daemon=True).start()


def _shutdown_listener():
    separator = '*' * 150
    if listener and listener.handlers:
        for handler in listener.handlers:
            if isinstance(handler, logging.FileHandler):
                if handler.stream:
                    try:
                        record = logging.LogRecord(
                            name="shutdown",
                            level=logging.INFO,
                            pathname=__file__,
                            lineno=0,
                            msg=separator,
                            args=(),
                            exc_info=None
                        )
                        record.created = time.time()
                        handler.emit(record)
                    except Exception:
                        pass

    if listener:
        listener.stop()


atexit.register(_shutdown_listener)


def get_logger(name: str, system_type: str = 'backend') -> logging.Logger:
    logger = logging.getLogger(f"{name}.{system_type}")
    logger.setLevel(logging.INFO)

    if logger.handlers:
        return logger

    queue_handler = QueueHandler(log_queue)
    logger.addHandler(queue_handler)

    return logger
