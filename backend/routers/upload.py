from fastapi import APIRouter, Request

from backend.schemas.speed import UploadResult
from backend.services.upload import measure_upload

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post(
    "",
    response_model=UploadResult,
    summary="Upload speed test",
    description=(
        "Send any binary payload via POST. "
        "The server measures elapsed time and returns the upload speed."
    ),
)
async def upload_speed(request: Request) -> UploadResult:
    return await measure_upload(request)
