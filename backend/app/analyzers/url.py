import ipaddress
import re
from urllib.parse import urlparse

from app.engine.indicators import create_indicator
from app.engine.risk_engine import analyze_risk


SHORTENERS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "is.gd",
    "goo.gl",
    "ow.ly",
    "cutt.ly",
    "rb.gy",
}

SUSPICIOUS_KEYWORDS = {
    "login",
    "verify",
    "verification",
    "secure",
    "account",
    "update",
    "password",
    "wallet",
    "payment",
    "claim",
}


def analyze_url(url: str):
    indicators = []

    candidate = url.strip()

    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", candidate):
        candidate = "https://" + candidate

    parsed = urlparse(candidate)
    hostname = (parsed.hostname or "").lower()

    valid_hostname = (
        bool(hostname)
        and "." in hostname
        and not hostname.startswith(".")
        and not hostname.endswith(".")
        and " " not in hostname
    )

    if not valid_hostname:
        indicators.append(
            create_indicator(
                "INVALID_URL",
                "HIGH",
                "The supplied value does not contain a valid hostname.",
            )
        )

        return analyze_risk(
            input_type="URL",
            threat_type="INVALID_INPUT",
            indicators=indicators,
        )

    if parsed.scheme.lower() == "http":
        indicators.append(
            create_indicator(
                "NO_HTTPS",
                "MEDIUM",
                "The URL uses HTTP instead of HTTPS.",
            )
        )

    try:
        ipaddress.ip_address(hostname)

        indicators.append(
            create_indicator(
                "IP_ADDRESS_HOST",
                "HIGH",
                "The URL uses a raw IP address instead of a domain name.",
            )
        )
    except ValueError:
        pass

    if hostname in SHORTENERS:
        indicators.append(
            create_indicator(
                "URL_SHORTENER",
                "MEDIUM",
                "The URL uses a known URL-shortening service, which hides the final destination.",
            )
        )

    is_ip_address = False

    try:
        ipaddress.ip_address(hostname)
        is_ip_address = True
    except ValueError:
        pass

    if not is_ip_address:
        parts = hostname.split(".")

        if len(parts) >= 4:
            indicators.append(
                create_indicator(
                    "EXCESSIVE_SUBDOMAINS",
                    "MEDIUM",
                    "The hostname contains multiple subdomain levels.",
                )
            )

    matched_keywords = [
        keyword
        for keyword in SUSPICIOUS_KEYWORDS
        if keyword in candidate.lower()
    ]

    if matched_keywords:
        indicators.append(
            create_indicator(
                "SUSPICIOUS_KEYWORD",
                "LOW",
                "The URL contains security, account, payment, or verification-related keywords.",
            )
        )

    if "%" in candidate:
        indicators.append(
            create_indicator(
                "ENCODED_URL",
                "LOW",
                "The URL contains percent-encoded characters that may obscure part of its structure.",
            )
        )

    threat_type = "SUSPICIOUS_URL" if indicators else "BENIGN"

    return analyze_risk(
        input_type="URL",
        threat_type=threat_type,
        indicators=indicators,
    )
