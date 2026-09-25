from pathlib import Path
import re

import pytesseract
from PIL import Image

from app.analyzers.text import analyze_text
from app.analyzers.url import analyze_url
from app.engine.indicators import create_indicator
from app.engine.risk_engine import analyze_risk


def extract_text(image_path: str) -> str:
    path = Path(image_path)

    if not path.exists():
        raise ValueError("The supplied image file does not exist.")

    try:
        image = Image.open(path)
    except Exception as error:
        raise ValueError(f"Could not open the supplied image: {error}")

    text = pytesseract.image_to_string(image).strip()

    if not text:
        raise ValueError("No readable text was detected in the image.")

    return text


def normalize_ocr_urls(text: str) -> str:
    normalized = text

    replacements = {
        "hitp//": "http://",
        "htlp//": "http://",
        "ht1p//": "http://",
        "https//": "https://",
        "http//": "http://",
        "S0": "50",
        "}": "/",
        "llogin": "/login",
    }

    for old, new in replacements.items():
        normalized = normalized.replace(old, new)

    return normalized


def extract_urls(text: str) -> list[str]:
    normalized = normalize_ocr_urls(text)

    matches = re.findall(
        r'(?:https?://|www\.)[^\s<>"\[\]()]+',
        normalized,
        flags=re.IGNORECASE,
    )

    cleaned_urls = []

    for url in matches:
        url = url.rstrip(".,;:!?")

        if url.startswith(("http://", "https://", "www.")):
            cleaned_urls.append(url)

    return cleaned_urls


def analyze_image(image_path: str):
    try:
        extracted_text = extract_text(image_path)

    except ValueError as error:
        indicator = create_indicator(
            "OCR_FAILED",
            "MEDIUM",
            str(error),
        )

        return analyze_risk(
            input_type="SCREENSHOT",
            threat_type="INVALID_INPUT",
            indicators=[indicator],
        )

    urls = extract_urls(extracted_text)

    if urls:
        url_results = [analyze_url(url) for url in urls]

        indicators = []
        for result in url_results:
            indicators.extend(result.indicators)

        result = analyze_risk(
            input_type="SCREENSHOT",
            threat_type="SUSPICIOUS_URL" if indicators else "BENIGN",
            indicators=indicators,
        )

        result.analysis = (
            f"OCR extracted text from the image and detected "
            f"{len(urls)} web link{'s' if len(urls) != 1 else ''}. "
            f"The detected link{'s were' if len(urls) != 1 else ' was'} analyzed "
            f"for suspicious URL indicators."
        )

        return result

    result = analyze_text(extracted_text)
    result.input_type = "SCREENSHOT"

    return result
