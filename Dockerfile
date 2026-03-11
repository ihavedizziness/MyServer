# ── Stage 1: Build React frontend ────────────────────────────────────────────
FROM node:24-slim AS frontend-builder

# Place frontend at /build/frontend so ../static resolves to /build/static
WORKDIR /build/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build
# Output lands at /build/static (vite outDir: ../static)

# ── Stage 2: Python backend ───────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Overwrite static/ with the freshly built frontend
COPY --from=frontend-builder /build/static ./static

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
