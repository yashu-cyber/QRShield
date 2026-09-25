import re

from app.analyzers.text import analyze_text
from app.engine.indicators import create_indicator
from app.engine.risk_engine import analyze_risk


def normalize_phone(phone: str) -> str:
    return re.sub(r"[^\d+]", "", phone.strip())


def analyze_phone(phone: str, context: str = ""):
    raw_phone = phone.strip()
    normalized_phone = normalize_phone(phone)

    if not raw_phone or not normalized_phone:
        indicator = create_indicator(
            "INVALID_PHONE",
            "LOW",
            "No valid phone number was supplied.",
        )

        result = analyze_risk(
            input_type="PHONE",
            threat_type="INVALID_INPUT",
            indicators=[],
        )

        result.analysis = "The supplied value is not a valid phone number."
        result.indicators = [indicator]

        return result

    if not re.fullmatch(r"\+?[0-9\s().-]+", raw_phone):
        indicator = create_indicator(
            "INVALID_PHONE",
            "LOW",
            "The supplied phone number contains invalid characters.",
        )

        result = analyze_risk(
            input_type="PHONE",
            threat_type="INVALID_INPUT",
            indicators=[],
        )

        result.analysis = "The supplied value is not a valid phone number."
        result.indicators = [indicator]

        return result

    digits = normalized_phone.replace("+", "")

    if len(digits) < 7 or len(digits) > 15:
        indicator = create_indicator(
            "INVALID_PHONE_LENGTH",
            "LOW",
            "The phone number length is outside the expected international range.",
        )

        result = analyze_risk(
            input_type="PHONE",
            threat_type="INVALID_INPUT",
            indicators=[],
        )

        result.analysis = "The supplied phone number has an invalid length."
        result.indicators = [indicator]

        return result

    indicators = []

    if context.strip():
        context_result = analyze_text(context)
        indicators.extend(context_result.indicators)

    threat_type = "PHONE_SCAM" if indicators else "BENIGN"

    result = analyze_risk(
        input_type="PHONE",
        threat_type=threat_type,
        indicators=indicators,
    )

    if context.strip():
        result.analysis = (
            "The phone number format was analyzed together with the supplied "
            "message or context for scam-related indicators."
        )
    else:
        result.analysis = (
            "The phone number format was analyzed. A phone number alone is "
            "not sufficient to establish that a caller or sender is malicious."
        )

    return result
