FROM python:latest
WORKDIR /backend

COPY /docker/backend/requirements.txt .
COPY main.py .
COPY database .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
