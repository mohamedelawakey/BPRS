FROM python:3.12-slim

WORKDIR /app

COPY ml/requirements.txt ./ml/
COPY backend/requirements.txt ./backend/


RUN pip install --no-cache-dir -r ml/requirements.txt

COPY ml/ ./ml/
COPY backend/ ./backend/
COPY .env .

EXPOSE 7860

CMD ["python", "-m", "ml.test"]
