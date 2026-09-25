import re

from app.engine.indicators import create_indicator
from app.engine.risk_engine import analyze_risk


def analyze_text(text: str):
    indicators = []

    normalized_text = text.lower()

    if re.search(
        r"\b(urgent|immediately|act now|final warning|last chance|within \d+ minutes?)\b",
        normalized_text,
    ):
        indicators.append(
            create_indicator(
                "URGENT_LANGUAGE",
                "MEDIUM",
                "Uses urgent or pressure-based language to encourage immediate action.",
            )
        )

    if re.search(
        r"\b(otp|one[- ]time password|verification code|security code|pin)\b",
        normalized_text,
    ):
        indicators.append(
            create_indicator(
                "OTP_REQUEST",
                "HIGH",
                "Mentions an OTP, verification code, PIN, or similar authentication credential.",
            )
        )

    if re.search(
        r"\b(password|passcode|login details|credentials|username)\b",
        normalized_text,
    ):
        indicators.append(
            create_indicator(
                "CREDENTIAL_REQUEST",
                "HIGH",
                "Requests or references sensitive account credentials.",
            )
        )

    if re.search(
        r"\b(pay|payment|paying|processing fee|transfer|send money|upi|refund fee)\b",
        normalized_text,
    ):
        indicators.append(
            create_indicator(
                "PAYMENT_REQUEST",
                "HIGH",
                "Contains language associated with requesting money or payment.",
            )
        )

    if re.search(
        r"\b(prize|winner|won|lottery|reward|cash prize|congratulations)\b",
        normalized_text,
    ):
        indicators.append(
            create_indicator(
                "PRIZE_SCAM_SIGNAL",
                "MEDIUM",
                "Contains prize, lottery, reward, or unexpected-winner language.",
            )
        )

    if re.search(
        r"(https?://|www\.)",
        normalized_text,
    ):
        indicators.append(
            create_indicator(
                "LINK_PRESENT",
                "LOW",
                "The message contains a web link that should be verified before opening.",
            )
        )

    threat_type = "PHISHING" if indicators else "BENIGN"

    return analyze_risk(
        input_type="SMS",
        threat_type=threat_type,
        indicators=indicators,
    )
