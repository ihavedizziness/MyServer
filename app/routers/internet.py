from fastapi import APIRouter, Depends, HTTPException

from app.config import Settings, get_settings
from app.schemas.speed import InternetSpeedResult
from app.services.speedtest import run_internet_speed_test

router = APIRouter(prefix="/internet-speed", tags=["Internet Speed"])


@router.get(
    "",
    response_model=InternetSpeedResult,
    summary="Server internet speed test",
    description=(
        "Runs speedtest-cli on the server to measure its own internet connection. "
        "Returns ping, download speed, upload speed, and ISP info. Takes ~30 seconds."
    ),
)
async def internet_speed(settings: Settings = Depends(get_settings)) -> InternetSpeedResult:
    try:
        return await run_internet_speed_test(settings)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
