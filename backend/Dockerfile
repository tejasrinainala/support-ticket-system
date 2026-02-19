FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["sh", "-c", "python core/manage.py migrate && python core/manage.py runserver 0.0.0.0:8000"]
