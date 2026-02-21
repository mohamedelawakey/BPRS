from ml.pipeline.v1.feature import FeatureExtractor


def test_feature_extractor_empty_input():
    result = FeatureExtractor.feature_extractor("")
    assert result['tech_score'] == 0


def test_feature_extractor_no_tech_words():
    text = "A random novel about a boy in a magical world."
    result = FeatureExtractor.feature_extractor(text)
    assert result['tech_score'] == 0
    assert "boy" in result['name_cleaned']


def test_feature_extractor_with_tech_words():
    text = "Learn Python, React, and Machine Learning for backend devops."
    result = FeatureExtractor.feature_extractor(text)
    assert result['tech_score'] >= 5
    assert "python" in result['name_cleaned']


def test_feature_extractor_case_insensitivity():
    text = "PYTHON and rEaCt"
    result = FeatureExtractor.feature_extractor(text)
    assert result['tech_score'] == 2
