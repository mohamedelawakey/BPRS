FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev\
    gcc\
    &&rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./backend/
COPY ml/requirements.txt ./ml/

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r backend/requirements.txt -r ml/requirements.txt

COPY backend/ /app/backend/
COPY ml/ /app/ml/
ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
