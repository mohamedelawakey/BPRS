from dotenv import load_dotenv
import os

load_dotenv()

EF_SEARCH = int(os.getenv('HNSW_EF_SEARCH', 120))


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
        SELECT book_id, name, name_cleaned, authors, publisher, description,
        description_cleaned, rating, publishyear, weighted_rating,
        counts_of_review_scaled, tech_score_scaled, publishyear_scaled,
        average_low_rating, average_high_rating
        FROM books
        WHERE book_id = ANY(%s::int[])
    """

    # books
    top_k = 100
    top_k_rerank = 50
