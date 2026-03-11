from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from backend.config import Settings, get_settings
from backend.services.download import stream_random_bytes

router = APIRouter(prefix="/download", tags=["Download"])


@router.get(
    "",
    summary="Download speed test",
    description="Streams random bytes from the server. The client measures how fast it receives them.",
    response_class=StreamingResponse,
)
def download_speed(
    size_mb: int = 25,
    settings: Settings = Depends(get_settings),
) -> StreamingResponse:
    if not 1 <= size_mb <= settings.max_download_mb:
        raise HTTPException(
            status_code=400,
            detail=f"size_mb must be between 1 and {settings.max_download_mb}",
        )

    total_bytes = size_mb * 1024 * 1024

    return StreamingResponse(
        stream_random_bytes(total_bytes, settings.chunk_size_bytes),
        media_type="application/octet-stream",
        headers={
            "Content-Length": str(total_bytes),
            "Cache-Control": "no-store",
            "X-Size-MB": str(size_mb),
        },
    )
