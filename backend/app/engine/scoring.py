from typing import List

from app.models.schemas import Indicator


SEVERITY_POINTS = {
    "LOW": 10,
    "MEDIUM": 20,
    "HIGH": 30,
    "CRITICAL": 40,
}


def calculate_risk_score(indicators: List[Indicator]) -> int:
    score = sum(
        SEVERITY_POINTS.get(indicator.severity.upper(), 0)
        for indicator in indicators
    )

    return min(score, 100)


def get_risk_level(score: int) -> str:
    if score >= 80:
        return "CRITICAL"
    if score >= 60:
        return "HIGH"
    if score >= 40:
        return "MEDIUM"
    if score >= 20:
        return "SUSPICIOUS"
    return "LOW"
