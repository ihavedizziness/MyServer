import asyncio

import speedtest as speedtest_lib

from app.config import Settings
from app.schemas.speed import InternetSpeedResult, SpeedTestServer


async def run_internet_speed_test(settings: Settings) -> InternetSpeedResult:
    """Run speedtest-cli in a thread pool to avoid blocking the event loop."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _run_sync, settings)


def _run_sync(settings: Settings) -> InternetSpeedResult:
    st = speedtest_lib.Speedtest(secure=True)
    st.get_best_server()
    st.download(threads=settings.speedtest_threads)
    st.upload(threads=settings.speedtest_threads)

    res = st.results.dict()
    srv = res.get("server", {})
    client = res.get("client", {})

    return InternetSpeedResult(
        ping_ms=round(res.get("ping", 0), 2),
        download_mbps=round(res.get("download", 0) / 1_000_000, 2),
        upload_mbps=round(res.get("upload", 0) / 1_000_000, 2),
        server=SpeedTestServer(
            name=srv.get("name", ""),
            country=srv.get("country", ""),
            sponsor=srv.get("sponsor", ""),
            latency=round(srv.get("latency", 0), 2),
        ),
        client_ip=client.get("ip", ""),
        isp=client.get("isp", ""),
        timestamp=res.get("timestamp", ""),
    )
