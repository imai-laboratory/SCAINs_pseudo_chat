FROM python:latest
WORKDIR /backend

COPY /docker/backend/requirements.txt .
RUN pip install -r /backend/requirements.txt

COPY main.py /backend/

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
