from fastapi import FastAPI

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
