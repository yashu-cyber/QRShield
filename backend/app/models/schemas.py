from pydantic import BaseModel
from typing import List


class Indicator(BaseModel):
    type: str
    severity: str
    message: str


class RiskResult(BaseModel):
    risk_score: int
    risk_level: str
    threat_type: str
    input_type: str
    indicators: List[Indicator]
    recommendation: str
    analysis: str
