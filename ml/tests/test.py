import time
import sys
import os
sys.path.append(os.getcwd())

from ml.inference.search import Search
from ml.reranking.reranking import Reranker
from backend.app.core.logging import get_logger

logger = get_logger("ml_test", system_type="ml")


def main():
    time.sleep(1)

    user_input = "deep learning"
    logger.info(f"Starting ML test with query: '{user_input}'")

    print("Running search...")
    logger.info("Running search...")
    start_search = time.time()
    search_results = Search.search(user_input, top_k=100)
    end_search = time.time()
    search_time = end_search - start_search

    msg_found = f"Found {len(search_results)} books"
    print(msg_found)
    logger.info(msg_found)

    msg_search_time = f"Search time: {search_time:.2f} seconds"
    print(msg_search_time)
    logger.info(msg_search_time)

    print("\nRunning reranker...")
    logger.info("Running reranker...")
    start_rerank = time.time()
    reranked_results = Reranker.reranker(search_results, top_k=50)
    end_rerank = time.time()
    rerank_time = end_rerank - start_rerank

    msg_rerank_count = f"Top {len(reranked_results)} reranked books:"
    print(msg_rerank_count)
    logger.info(msg_rerank_count)

    msg_rerank_time = f"Rerank time: {rerank_time:.2f} seconds"
    print(msg_rerank_time)
    logger.info(msg_rerank_time)

    total_time = search_time + rerank_time
    msg_total_time = f"Total time: {total_time:.2f} seconds"
    print(f"\n{msg_total_time}")
    logger.info(msg_total_time)

    print("\nTop 5 books:")
    logger.info("Top 5 books:")
    for book in reranked_results[:5]:
        book_info = f"  {book['name']} - {book.get('rerank_score', book['similarity']):.4f}"
        print(book_info)
        logger.info(book_info)

    time.sleep(1)


if __name__ == "__main__":
    main()
