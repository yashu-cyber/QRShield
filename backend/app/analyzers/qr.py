from pathlib import Path

import cv2

from app.analyzers.text import analyze_text
from app.analyzers.payment import analyze_payment
from app.analyzers.url import analyze_url
from app.engine.indicators import create_indicator
from app.engine.risk_engine import analyze_risk


def decode_qr(image_path: str) -> str:
    image = cv2.imread(str(Path(image_path)))

    if image is None:
        raise ValueError("Could not read the supplied image.")

    detector = cv2.QRCodeDetector()

    data, points, _ = detector.detectAndDecode(image)

    if not data:
        raise ValueError("No readable QR code was detected in the image.")

    return data


def analyze_qr(image_path: str):
    try:
        data = decode_qr(image_path)

    except ValueError as error:
        indicator = create_indicator(
            "QR_DECODE_FAILED",
            "MEDIUM",
            str(error),
        )

        return analyze_risk(
            input_type="QR",
            threat_type="INVALID_INPUT",
            indicators=[indicator],
        )

    if data.lower().startswith("upi://pay"):
        result = analyze_payment(data)
        result.input_type = "QR"
        return result

    if data.lower().startswith(("http://", "https://", "www.")):
        result = analyze_url(data)
        result.input_type = "QR"
        return result

    result = analyze_text(data)
    result.input_type = "QR"

    return result
