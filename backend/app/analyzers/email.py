import re
from email import policy
from email.parser import BytesParser
from pathlib import Path

from app.analyzers.text import analyze_text
from app.analyzers.url import analyze_url
from app.engine.indicators import create_indicator
from app.engine.risk_engine import analyze_risk


def extract_urls(text: str) -> list[str]:
    return re.findall(
        r"(?:https?://|www\.)[^\s<>\"]+",
        text,
        flags=re.IGNORECASE,
    )


def parse_email(file_path: str) -> tuple[str, str, str]:
    path = Path(file_path)

    if not path.exists():
        raise ValueError("The supplied email file does not exist.")

    try:
        with path.open("rb") as email_file:
            message = BytesParser(policy=policy.default).parse(email_file)
    except Exception as error:
        raise ValueError(f"Could not parse the email file: {error}")

    sender = message.get("From", "")
    subject = message.get("Subject", "")

    body_parts = []

    if message.is_multipart():
        for part in message.walk():
            if part.get_content_type() == "text/plain":
                try:
                    body_parts.append(part.get_content())
                except Exception:
                    continue
    else:
        try:
            body_parts.append(message.get_content())
        except Exception:
            pass

    body = "\n".join(body_parts).strip()

    return sender, subject, body


def analyze_email(file_path: str):
    try:
        sender, subject, body = parse_email(file_path)

    except ValueError as error:
        indicator = create_indicator(
            "EMAIL_PARSE_FAILED",
            "MEDIUM",
            str(error),
        )

        return analyze_risk(
            input_type="EMAIL",
            threat_type="INVALID_INPUT",
            indicators=[indicator],
        )

    combined_text = f"{subject}\n{body}".strip()

    text_result = analyze_text(combined_text)

    indicators = list(text_result.indicators)

    urls = extract_urls(combined_text)

    for url in urls:
        url_result = analyze_url(url)
        indicators.extend(url_result.indicators)

    sender_domain = ""

    if "@" in sender:
        sender_domain = sender.rsplit("@", 1)[1].strip().lower()

    if sender_domain:
        if re.search(r"\d{4,}", sender_domain):
            indicators.append(
                create_indicator(
                    "SUSPICIOUS_SENDER_DOMAIN",
                    "MEDIUM",
                    "The sender domain contains an unusually long numeric sequence.",
                )
            )

        if sender_domain.startswith("xn--"):
            indicators.append(
                create_indicator(
                    "PUNYCODE_DOMAIN",
                    "HIGH",
                    "The sender domain uses punycode, which can be used to represent lookalike internationalized domains.",
                )
            )

    threat_type = "PHISHING" if indicators else "BENIGN"

    result = analyze_risk(
        input_type="EMAIL",
        threat_type=threat_type,
        indicators=indicators,
    )

    result.analysis = (
        f"The email was parsed successfully. "
        f"It contained {len(urls)} detected web link"
        f"{'s' if len(urls) != 1 else ''}. "
        f"The subject, body, sender domain, and detected links were analyzed."
    )

    return result
