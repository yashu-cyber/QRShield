from urllib.parse import parse_qs, urlparse

from app.engine.indicators import create_indicator
from app.engine.risk_engine import analyze_risk


def parse_upi_uri(data: str) -> dict:
    if not data.lower().startswith("upi://pay"):
        raise ValueError("The supplied QR data is not a supported UPI payment URI.")

    parsed = urlparse(data)
    params = parse_qs(parsed.query)

    return {
        "pa": params.get("pa", [""])[0],
        "pn": params.get("pn", [""])[0],
        "am": params.get("am", [""])[0],
        "cu": params.get("cu", [""])[0],
        "mc": params.get("mc", [""])[0],
        "tr": params.get("tr", [""])[0],
        "tn": params.get("tn", [""])[0],
    }


def analyze_payment(data: str):
    try:
        payment = parse_upi_uri(data)

    except ValueError as error:
        indicator = create_indicator(
            "INVALID_PAYMENT_URI",
            "LOW",
            str(error),
        )

        result = analyze_risk(
            input_type="QR",
            threat_type="INVALID_INPUT",
            indicators=[],
        )

        result.indicators = [indicator]
        result.analysis = "The supplied QR data is not a supported UPI payment URI."

        return result

    indicators = []

    if not payment["pa"]:
        indicators.append(
            create_indicator(
                "MISSING_PAYMENT_ADDRESS",
                "MEDIUM",
                "The payment URI does not contain a recipient UPI address.",
            )
        )

    if not payment["pn"]:
        indicators.append(
            create_indicator(
                "MISSING_PAYEE_NAME",
                "LOW",
                "The payment URI does not contain a payee name.",
            )
        )

    if payment["am"]:
        try:
            amount = float(payment["am"])

            if amount <= 0:
                indicators.append(
                    create_indicator(
                        "INVALID_PAYMENT_AMOUNT",
                        "MEDIUM",
                        "The payment amount is zero or negative.",
                    )
                )

        except ValueError:
            indicators.append(
                create_indicator(
                    "INVALID_PAYMENT_AMOUNT",
                    "MEDIUM",
                    "The payment amount is not a valid numeric value.",
                )
            )

    if payment["cu"] and payment["cu"].upper() != "INR":
        indicators.append(
            create_indicator(
                "UNEXPECTED_CURRENCY",
                "MEDIUM",
                "The payment URI specifies a currency other than INR.",
            )
        )

    if payment["tn"]:
        note = payment["tn"].lower()

        suspicious_terms = (
            "otp",
            "password",
            "pin",
            "urgent",
            "verify",
            "refund",
            "fee",
        )

        if any(term in note for term in suspicious_terms):
            indicators.append(
                create_indicator(
                    "SUSPICIOUS_PAYMENT_NOTE",
                    "HIGH",
                    "The payment note contains language associated with verification, credentials, urgency, or fees.",
                )
            )

    threat_type = "PAYMENT_REQUEST" if indicators else "BENIGN"

    result = analyze_risk(
        input_type="QR",
        threat_type=threat_type,
        indicators=indicators,
    )

    result.analysis = (
        "The QR payload was parsed as a UPI payment request. "
        "The recipient, payee information, amount, currency, and payment note "
        "were checked for suspicious characteristics."
    )

    return result
