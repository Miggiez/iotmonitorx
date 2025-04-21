# Use an official Python base image
FROM python:alpine

# Set the working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Set Python path to include current directory
ENV PYTHONPATH=/app

# Set the command to run FastAPI
CMD ["uvicorn", "admin_main:app", "--host", "0.0.0.0", "--port", "7000"]
