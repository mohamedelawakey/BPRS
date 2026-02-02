import re
from bs4 import BeautifulSoup
from Enum.Enumerations import Enumerations
from backend.app.core.logging import get_logger

logger = get_logger(__name__, system_type="ml")


class TextCleaner:
    @staticmethod
    def text_cleaner(text: str) -> str:
        if not text:
            logger.warning('Received empty text for cleaning')
            return ""

        try:
            text = BeautifulSoup(text, 'lxml').get_text(separator=' ')
            text = re.sub(Enumerations.pattern_domain, ' ', text)
            text = re.sub(Enumerations.pattern_page_numbers, ' ', text)
            text = re.sub(Enumerations.pattern_punctuation_end_sen, r'\1', text)
            text = re.sub(Enumerations.pattern_punctuation_lines_repeated, ' ', text)
            text = re.sub(Enumerations.non_printing_control_characters, ' ', text)
            text = re.sub(Enumerations.useless_symbols_and_signs, ' ', text)
            text = re.sub(Enumerations.pattern_more_space_line_removal, ' ', text)
            text = text.lower()
            logger.info('Text cleaned successfully')
        except Exception as e:
            logger.error(f'Error cleaning text: {e}')
            return ""

        return text
