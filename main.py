# Re-export for `uvicorn main:app` compatibility.
from backend.main import app

__all__ = ["app"]
