# Multi-stage build for smaller final image
FROM python:3.12-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libsndfile1-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages to a specific location
COPY apps/backend/src/aws/sagemaker/model/code/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --target /app/packages -r requirements.txt

# Final stage
FROM python:3.12-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /app/packages /usr/local/lib/python3.12/site-packages

# Copy inference code
COPY apps/backend/src/aws/sagemaker/model/code/inference.py /opt/ml/model/code/

# Set Python path and working directory
ENV PYTHONPATH=/usr/local/lib/python3.12/site-packages
ENV SAGEMAKER_PROGRAM=inference.py
WORKDIR /opt/ml/model

# SageMaker entry point
ENTRYPOINT ["python", "/opt/ml/model/code/inference.py"]