from dotenv import load_dotenv
import os

load_dotenv()

EF_SEARCH = int(os.getenv('HNSW_EF_SEARCH', 120))
RERANK_WEIGHT_SIMILARITY = float(os.getenv('RERANK_WEIGHT_SIMILARITY', 0.5))
RERANK_WEIGHT_WEIGHTED_RATING = float(os.getenv('RERANK_WEIGHT_WEIGHTED_RATING', 0.2))
RERANK_WEIGHT_COUNTS_OF_REVIEW = float(os.getenv('RERANK_WEIGHT_COUNTS_OF_REVIEW', 0.15))
RERANK_WEIGHT_TECH_SCORE = float(os.getenv('RERANK_WEIGHT_TECH_SCORE', 0.05))
RERANK_WEIGHT_PUBLISHYEAR = float(os.getenv('RERANK_WEIGHT_PUBLISHYEAR', 0.05))
RERANK_WEIGHT_AVERAGE_LOW = float(os.getenv('RERANK_WEIGHT_AVERAGE_LOW', 0.05))
MIN_CONNECTIONS = int(os.getenv('MIN_CONNECTIONS', 1))
MAX_CONNECTIONS = int(os.getenv('MAX_CONNECTIONS', 20))


class Enumerations():
    # cleaning patterns
    pattern_domain = r'https?://\S+|www\.\S+'
    pattern_page_numbers = r'\[\d+\]|\(p\.\s*\d+\)'
    pattern_more_space_line_removal = r'\s+'
    pattern_punctuation_end_sen = r'([.!?])\1+'
    pattern_punctuation_lines_repeated = r'[-_*/]{2,}'
    non_printing_control_characters = r'[^\x00-\x7F]+'
    useless_symbols_and_signs = r'[^\w\s]'

    # SQL Queries
    ef_search = f'SET hnsw.ef_search = {EF_SEARCH};'

    vector_service_query = """
        SELECT
            book_id,
            1 - (embedding <=> %s::vector) AS similarity
        FROM books
        ORDER BY embedding <=> %s::vector
        LIMIT %s;
    """

    metadata_service_query = """
        SELECT book_id, name_cleaned AS name, authors, publisher,
        description_cleaned AS description, rating, publishyear, weighted_rating,
        counts_of_review_scaled, tech_score_scaled, publishyear_scaled,
        average_low_rating, average_high_rating
        FROM books
        WHERE book_id = ANY(%s::int[])
    """

    # books
    top_k = 100
    top_k_rerank = 50
    
    # Reranker Weights
    weight_similarity = RERANK_WEIGHT_SIMILARITY
    weight_weighted_rating = RERANK_WEIGHT_WEIGHTED_RATING
    weight_counts_of_review = RERANK_WEIGHT_COUNTS_OF_REVIEW
    weight_tech_score = RERANK_WEIGHT_TECH_SCORE
    weight_publishyear = RERANK_WEIGHT_PUBLISHYEAR
    weight_average_low = RERANK_WEIGHT_AVERAGE_LOW

    # Connections
    min_connections = MIN_CONNECTIONS
    max_connections = MAX_CONNECTIONS
