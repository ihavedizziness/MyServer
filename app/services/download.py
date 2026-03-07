import os
from collections.abc import Iterator


def stream_random_bytes(total_bytes: int, chunk_size: int) -> Iterator[bytes]:
    """Yield random byte chunks until total_bytes have been generated."""
    sent = 0
    while sent < total_bytes:
        size = min(chunk_size, total_bytes - sent)
        yield os.urandom(size)
        sent += size
