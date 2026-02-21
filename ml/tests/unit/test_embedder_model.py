from ml.models.v1.embedder import Model


def test_model_singleton_initialization(mocker):
    mock_transformer = mocker.patch('ml.models.v1.embedder.SentenceTransformer')
    mock_instance = mocker.MagicMock()
    mock_transformer.return_value = mock_instance

    Model._model = None

    model1 = Model.model()
    assert model1 is mock_instance
    mock_transformer.assert_called_once_with('all-MiniLM-L6-v2')

    model2 = Model.model()
    assert model2 is mock_instance
    assert mock_transformer.call_count == 1
