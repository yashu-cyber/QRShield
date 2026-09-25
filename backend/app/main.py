from fastapi import FastAPI

from app.api.analyze import router as analyze_router

app = FastAPI(
    title="QRShield API",
    description="Multimodal scam and phishing risk analysis engine",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "name": "QRShield",
        "status": "online",
        "message": "Don't trust it. Analyze it.",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(analyze_router)
