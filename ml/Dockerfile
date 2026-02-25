FROM python:3.12-slim

WORKDIR /app

COPY ml/requirements.txt ./ml/
COPY backend/requirements.txt ./backend/

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r ml/requirements.txt

COPY ml/ ./ml/
COPY backend/ ./backend/

EXPOSE 7860

CMD ["tail", "-f", "/dev/null"]
