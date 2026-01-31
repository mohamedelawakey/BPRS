class Enumerations():
    # cleaning patterns
    pattern_domain = r'https?://\S+|www\.\S+'
    pattern_page_numbers = r'\[\d+\]|\(p\.\s*\d+\)'
    pattern_more_space_line_removal = r'\s+'
    pattern_punctuation_end_sen = r'([.!?])\1+'
    pattern_punctuation_lines_repeated = r'[-_*/]{2,}'
    non_printing_control_characters = r'[^\x00-\x7F]+'
    useless_symbols_and_signs = r'[^\w\s]'
