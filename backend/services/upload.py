import time

from fastapi import Request

from app.schemas.speed import UploadResult


async def measure_upload(request: Request) -> UploadResult:
    """Consume the request stream and return server-measured upload metrics."""
    start = time.perf_counter()
    total_bytes = 0

    async for chunk in request.stream():
        total_bytes += len(chunk)

    elapsed = time.perf_counter() - start
    speed_mbps = round((total_bytes * 8) / (elapsed * 1_000_000), 2) if elapsed > 0 else 0.0

    return UploadResult(
        bytes_received=total_bytes,
        size_mb=round(total_bytes / (1024 * 1024), 2),
        time_seconds=round(elapsed, 3),
        speed_mbps=speed_mbps,
    )
