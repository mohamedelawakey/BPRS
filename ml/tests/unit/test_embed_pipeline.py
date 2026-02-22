from ml.pipeline.v1.embed import Embedder


def test_embedder_success(mocker):
    mock_feature = mocker.patch('ml.pipeline.v1.embed.FeatureExtractor.feature_extractor')
    mock_feature.return_value = {
        'name_cleaned': 'clean text test',
        'tech_score': 3
    }

    mock_model_class = mocker.patch('ml.pipeline.v1.embed.Model.model')
    mock_model_instance = mocker.MagicMock()
    mock_model_instance.encode.return_value = [[0.1, 0.2, 0.3]]
    mock_model_class.return_value = mock_model_instance

    result = Embedder.embedder("Clean Text Test")

    assert result['name_cleaned'] == 'clean text test'
    assert result['tech_score'] == 3
    assert result['name_embeddings'] == [0.1, 0.2, 0.3]
    mock_model_instance.encode.assert_called_once_with(['clean text test'])


def test_embedder_fallback_on_error(mocker):
    mocker.patch('ml.pipeline.v1.embed.FeatureExtractor.feature_extractor', side_effect=Exception("Test Error"))

    result = Embedder.embedder("Error Text")

    assert result['name_cleaned'] == "Error Text"
    assert result['tech_score'] == 0
    assert result['name_embeddings'] == []
