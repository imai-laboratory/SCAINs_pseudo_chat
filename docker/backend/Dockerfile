FROM python:latest
WORKDIR /app

COPY requirements.txt .
COPY app/ /app
COPY .env /app/.env

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
