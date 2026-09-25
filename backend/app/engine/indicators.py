from app.models.schemas import Indicator


def create_indicator(
    indicator_type: str,
    severity: str,
    message: str,
) -> Indicator:
    return Indicator(
        type=indicator_type,
        severity=severity,
        message=message,
    )
