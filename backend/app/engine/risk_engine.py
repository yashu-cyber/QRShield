from typing import List

from app.engine.scoring import calculate_risk_score, get_risk_level
from app.models.schemas import Indicator, RiskResult


def build_recommendation(risk_level: str) -> str:
    recommendations = {
        "LOW": "No major risk indicators were detected. Continue with normal caution.",
        "SUSPICIOUS": "Proceed carefully and verify the source before interacting.",
        "MEDIUM": "Avoid sharing sensitive information until the source is verified.",
        "HIGH": "Do not click links, share credentials, or make payments until the source is verified.",
        "CRITICAL": "Do not interact with this content. Treat it as potentially malicious and verify through an official source.",
    }

    return recommendations.get(
        risk_level,
        "Verify the source before taking any action.",
    )


def build_analysis(indicators: List[Indicator], risk_level: str) -> str:
    if not indicators:
        return "No significant risk indicators were detected."

    count = len(indicators)

    return (
        f"The analysis detected {count} risk indicator"
        f"{'s' if count != 1 else ''}. "
        f"The resulting risk level is {risk_level}."
    )


def analyze_risk(
    input_type: str,
    threat_type: str,
    indicators: List[Indicator],
) -> RiskResult:
    score = calculate_risk_score(indicators)
    risk_level = get_risk_level(score)

    return RiskResult(
        risk_score=score,
        risk_level=risk_level,
        threat_type=threat_type,
        input_type=input_type,
        indicators=indicators,
        recommendation=build_recommendation(risk_level),
        analysis=build_analysis(indicators, risk_level),
    )
