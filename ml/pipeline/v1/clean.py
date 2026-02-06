import re
from bs4 import BeautifulSoup
from ml.Enum.Enumerations import Enumerations
from backend.app.core.logging import get_logger

logger = get_logger(__name__, system_type='ml')


class TextCleaner:
    @staticmethod
    def _extract_text_from_html(text: str) -> str:
        try:
            soup = BeautifulSoup(text, 'lxml')
        except Exception as e:
            logger.warning(f'lxml parser failed, falling back to html.parser: {e}')
            soup = BeautifulSoup(text, 'html.parser')

        return soup.get_text(separator=' ')

    @staticmethod
    def text_cleaner(text: str) -> str:
        if not text:
            logger.warning('Received empty text for cleaning')
            return ""

        try:
            text = TextCleaner._extract_text_from_html(text)
            text = re.sub(Enumerations.pattern_domain, ' ', text)
            text = re.sub(Enumerations.pattern_page_numbers, ' ', text)
            text = re.sub(Enumerations.pattern_punctuation_end_sen, r'\1', text)
            text = re.sub(Enumerations.pattern_punctuation_lines_repeated, ' ', text)
            text = re.sub(Enumerations.non_printing_control_characters, ' ', text)
            text = re.sub(Enumerations.useless_symbols_and_signs, ' ', text)
            text = re.sub(Enumerations.pattern_more_space_line_removal, ' ', text)
            text = text.lower().strip()

            logger.info('Text cleaned successfully')

        except Exception as e:
            logger.error(f'Error cleaning text: {e}')
            return text

        return text
