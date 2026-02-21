from ml.pipeline.v1.clean import TextCleaner


def test_text_cleaner_empty_input():
    assert TextCleaner.text_cleaner("") == ""
    assert TextCleaner.text_cleaner(None) == ""


def test_text_cleaner_html_removal():
    html_text = "<p>This is a <b>bold</b> statement.</p>"
    cleaned = TextCleaner.text_cleaner(html_text)
    assert "<b>" not in cleaned
    assert "bold statement" in cleaned


def test_text_cleaner_url_removal():
    text = "Check this out https://example.com and www.google.com here."
    cleaned = TextCleaner.text_cleaner(text)
    assert "https://example.com" not in cleaned
    assert "www.google.com" not in cleaned
    assert "check this out" in cleaned
    assert "here" in cleaned


def test_text_cleaner_page_numbers():
    text = "Read chapter 1 [45] and also (p. 23)."
    cleaned = TextCleaner.text_cleaner(text)
    assert "[45]" not in cleaned
    assert "(p. 23)" not in cleaned


def test_text_cleaner_punctuation_normalization():
    text = "Why??? This is crazy!!!"
    cleaned = TextCleaner.text_cleaner(text)
    assert "why this is crazy" in cleaned


def test_text_cleaner_special_chars():
    text = "Hello @#$% World ^&*"
    cleaned = TextCleaner.text_cleaner(text)
    assert "hello" in cleaned
    assert "world" in cleaned
    assert "@" not in cleaned


def test_text_cleaner_repeated_lines():
    text = "Section 1\n-----\nSection 2\n*****"
    cleaned = TextCleaner.text_cleaner(text)
    assert "----" not in cleaned
    assert "****" not in cleaned
    assert "section 1" in cleaned
    assert "section 2" in cleaned
