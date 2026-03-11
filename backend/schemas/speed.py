from pydantic import BaseModel, Field


class UploadResult(BaseModel):
    bytes_received: int = Field(..., description="Total bytes received by the server")
    size_mb: float = Field(..., description="Size in megabytes")
    time_seconds: float = Field(..., description="Elapsed time on the server side")
    speed_mbps: float = Field(..., description="Upload speed in megabits per second")


class SpeedTestServer(BaseModel):
    name: str
    country: str
    sponsor: str
    latency: float = Field(..., description="Latency to the test server in ms")


class InternetSpeedResult(BaseModel):
    ping_ms: float = Field(..., description="Ping to the selected test server")
    download_mbps: float = Field(..., description="Server download speed in Mbps")
    upload_mbps: float = Field(..., description="Server upload speed in Mbps")
    server: SpeedTestServer
    client_ip: str
    isp: str
    timestamp: str
