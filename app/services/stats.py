import time

import psutil

from app.schemas.stats import GPUInfo, NetworkIO, ServerStats

try:
    import pynvml as _nvml
    _nvml.nvmlInit()
    _nvml_ok = True
except Exception:
    _nvml_ok = False


def _get_gpu_info() -> list[GPUInfo]:
    if not _nvml_ok:
        return []
    try:
        count = _nvml.nvmlDeviceGetCount()
        result = []
        for i in range(count):
            handle = _nvml.nvmlDeviceGetHandleByIndex(i)
            name = _nvml.nvmlDeviceGetName(handle)
            util = _nvml.nvmlDeviceGetUtilizationRates(handle)
            mem = _nvml.nvmlDeviceGetMemoryInfo(handle)
            try:
                temp = float(_nvml.nvmlDeviceGetTemperature(handle, _nvml.NVML_TEMPERATURE_GPU))
            except Exception:
                temp = 0.0
            mem_total_mb = round(mem.total / 1024 ** 2, 1)
            mem_used_mb = round(mem.used / 1024 ** 2, 1)
            mem_pct = round(mem.used / mem.total * 100, 1) if mem.total else 0.0
            result.append(GPUInfo(
                index=i,
                name=name if isinstance(name, str) else name.decode(),
                load_percent=float(util.gpu),
                memory_used_mb=mem_used_mb,
                memory_total_mb=mem_total_mb,
                memory_percent=mem_pct,
                temperature_c=temp,
            ))
        return result
    except Exception:
        return []


def get_server_stats() -> ServerStats:
    cpu = psutil.cpu_percent(interval=0.3)
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    net = psutil.net_io_counters()
    load = psutil.getloadavg()
    uptime = int(time.time() - psutil.boot_time())

    return ServerStats(
        cpu_percent=cpu,
        cpu_count=psutil.cpu_count(logical=True),
        load_avg_1=round(load[0], 2),
        load_avg_5=round(load[1], 2),
        load_avg_15=round(load[2], 2),
        ram_total_mb=round(ram.total / 1024 ** 2, 1),
        ram_used_mb=round(ram.used / 1024 ** 2, 1),
        ram_available_mb=round(ram.available / 1024 ** 2, 1),
        ram_percent=ram.percent,
        disk_total_gb=round(disk.total / 1024 ** 3, 1),
        disk_used_gb=round(disk.used / 1024 ** 3, 1),
        disk_free_gb=round(disk.free / 1024 ** 3, 1),
        disk_percent=disk.percent,
        net=NetworkIO(
            bytes_sent=net.bytes_sent,
            bytes_recv=net.bytes_recv,
            mb_sent=round(net.bytes_sent / 1024 ** 2, 1),
            mb_recv=round(net.bytes_recv / 1024 ** 2, 1),
        ),
        uptime_seconds=uptime,
        process_count=len(psutil.pids()),
        gpus=_get_gpu_info(),
    )
