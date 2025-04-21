FROM python:alpine

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Set Python path to include current directory
ENV PYTHONPATH=/app

CMD ["uvicorn", "user_main:app", "--host", "0.0.0.0", "--port", "8000"]