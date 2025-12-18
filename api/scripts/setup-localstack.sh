#!/bin/bash

# Setup LocalStack S3 for Development
# This script ensures the S3 bucket exists before starting the app

set -e

echo "🚀 Setting up LocalStack S3..."

# Wait for LocalStack to be ready
echo "⏳ Waiting for LocalStack to be ready..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:4566/_localstack/health > /dev/null 2>&1; then
        echo "✅ LocalStack is ready!"
        break
    fi
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ LocalStack failed to start after 30 seconds"
        exit 1
    fi
    sleep 1
done

# Create S3 bucket if it doesn't exist
echo "📦 Creating S3 bucket 'brewfest-dev'..."

export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

if aws --endpoint-url=http://localhost:4566 --region us-east-1 s3 ls s3://brewfest-dev > /dev/null 2>&1; then
    echo "✅ Bucket 'brewfest-dev' already exists"
else
    aws --endpoint-url=http://localhost:4566 --region us-east-1 s3 mb s3://brewfest-dev
    echo "✅ Created bucket 'brewfest-dev'"
fi

echo "🎉 LocalStack S3 setup complete!"
