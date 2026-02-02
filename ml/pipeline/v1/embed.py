from .feature import FeatureExtractor
from ml.models.v1.embedder import Model
from backend.app.core.logging import get_logger

logger = get_logger(__name__, system_type='ml')


class Embedder:
    @staticmethod
    def embedder(text: str) -> dict:
        model = Model.model()

        try:
            features_dict = FeatureExtractor.feature_extractor(text)
            tech_score = features_dict.get('tech_score', 0)
            name_cleaned = features_dict.get('name_cleaned', text)
            name_embeddings = model.encode([name_cleaned])[0]

            logger.info('Embeddings successfully created')

            return {
                'name_cleaned': name_cleaned,
                'tech_score': tech_score,
                'name_embeddings': name_embeddings
            }

        except Exception as e:
            logger.error(f'error: {e}')
            return {
                'name_cleaned': text,
                'tech_score': 0,
                'name_embeddings': []
            }
