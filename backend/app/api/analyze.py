from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import JSONResponse

from app.analyzers.email import analyze_email
from app.analyzers.image import analyze_image
from app.analyzers.phone import analyze_phone
from app.analyzers.qr import analyze_qr
from app.analyzers.text import analyze_text
from app.analyzers.url import analyze_url

router = APIRouter(prefix="/api", tags=["analysis"])


@router.post("/analyze")
async def analyze(
    input_type: str = Form(...),
    text: str = Form(""),
    phone: str = Form(""),
    context: str = Form(""),
    file: UploadFile | None = File(None),
):
    input_type = input_type.strip().upper()

    if input_type == "URL":
        if not text.strip():
            return JSONResponse(
                status_code=400,
                content={"error": "URL input is required."},
            )

        return analyze_url(text.strip()).model_dump()

    if input_type == "SMS":
        if not text.strip():
            return JSONResponse(
                status_code=400,
                content={"error": "SMS text is required."},
            )

        return analyze_text(text.strip()).model_dump()

    if input_type == "PHONE":
        if not phone.strip():
            return JSONResponse(
                status_code=400,
                content={"error": "Phone number is required."},
            )

        return analyze_phone(
            phone.strip(),
            context.strip(),
        ).model_dump()

    if input_type in {"QR", "SCREENSHOT", "EMAIL"}:
        if file is None:
            return JSONResponse(
                status_code=400,
                content={"error": "A file is required for this input type."},
            )

        suffix = Path(file.filename or "").suffix

        with NamedTemporaryFile(delete=False, suffix=suffix) as temporary_file:
            temporary_path = temporary_file.name
            temporary_file.write(await file.read())

        try:
            if input_type == "QR":
                result = analyze_qr(temporary_path)

            elif input_type == "SCREENSHOT":
                result = analyze_image(temporary_path)

            else:
                result = analyze_email(temporary_path)

            return result.model_dump()

        except Exception as error:
            return JSONResponse(
                status_code=500,
                content={
                    "error": "The supplied file could not be analyzed.",
                    "details": str(error),
                },
            )

        finally:
            Path(temporary_path).unlink(missing_ok=True)

    return JSONResponse(
        status_code=400,
        content={
            "error": (
                "Unsupported input type. "
                "Use QR, URL, SMS, PHONE, EMAIL, or SCREENSHOT."
            )
        },
    )
