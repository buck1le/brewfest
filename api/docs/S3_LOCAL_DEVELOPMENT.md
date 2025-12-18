# S3 Local Development Setup Guide

This guide covers setting up S3 storage for local development of the Brewfest API.

## Architecture Overview

### Current S3 Implementation

The project uses two S3 implementations:

1. **`images/src/s3.rs`** (Primary - In Use)
   - Production-ready S3 client with AWS SDK
   - Automatic image resizing (default: 800x600)
   - Converts all images to PNG format
   - Trait-based design (`S3Interface`) for testability
   - Used by all image upload handlers

2. **`web/src/utils/s3_uploader.rs`** (Legacy - Unused)
   - Simpler S3 uploader without image processing
   - Can be removed or kept for simple uploads

### How It Works

```
User Upload → Handler → images::upload() → S3::upload_object() → AWS S3/LocalStack
                            ↓
                    Resize & Convert to PNG
                            ↓
                    Store in: {folder}/{uuid}.png
```

Handlers using S3:
- `web/src/handlers/events/vendor/inventory/thumbnail.rs:18`
- `web/src/handlers/events/schedule/thumbnail.rs:18`
- `web/src/handlers/events/schedule/image.rs:22`

## Environment Variables

### Required Variables (Already in `.mise.toml`)

```toml
[env]
# Database
DATABASE_URL = "postgres://admin:password@127.0.0.1:5432/brewfest"

# S3 Configuration
S3_REGION = "us-east-2"
S3_BUCKET = "brewfest-dev"
S3_FOLDER = "images"

# AWS Credentials (for LocalStack/MinIO)
AWS_ACCESS_KEY_ID = "test"
AWS_SECRET_ACCESS_KEY = "test"
```

### Optional Variables

```bash
# Image resize dimensions (defaults: 800x600)
MAX_IMAGE_WIDTH=800
MAX_IMAGE_HEIGHT=600
```

## Local S3 Options

You have three options for local S3 development:

### Option 1: LocalStack (Recommended for AWS Compatibility)

LocalStack emulates AWS services locally, including S3.

#### Setup with Docker Compose

Add to your `docker-compose.yml`:

```yaml
services:
  localstack:
    image: localstack/localstack:latest
    ports:
      - "4566:4566"  # LocalStack gateway
      - "4510-4559:4510-4559"  # External services port range
    environment:
      - SERVICES=s3
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
      - DOCKER_HOST=unix:///var/run/docker.sock
    volumes:
      - "./localstack-data:/tmp/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
```

#### Start LocalStack

```bash
docker-compose up localstack -d
```

#### Create S3 Bucket

```bash
# Using AWS CLI
aws --endpoint-url=http://localhost:4566 s3 mb s3://brewfest-dev

# Or using docker exec
docker exec localstack awslocal s3 mb s3://brewfest-dev
```

#### Configure Your App

Update `images/src/s3.rs` to use LocalStack endpoint:

```rust
impl S3 {
    pub fn new() -> Pin<Box<dyn std::future::Future<Output = Result<Self, UploadError>>>>
    where
        Self: Sized,
    {
        Box::pin(async {
            let mut s3_config = aws_config::load_defaults(BehaviorVersion::latest()).await;

            // Use LocalStack endpoint in development
            if std::env::var("USE_LOCALSTACK").unwrap_or_default() == "true" {
                s3_config = aws_config::from_env()
                    .endpoint_url("http://localhost:4566")
                    .load()
                    .await;
            }

            let client = Arc::new(S3Client::new(&s3_config));
            // ... rest of the code
        })
    }
}
```

Add to `.mise.toml`:
```toml
USE_LOCALSTACK = "true"
```

### Option 2: MinIO (Lightweight Alternative)

MinIO is a lightweight, S3-compatible object storage server.

#### Setup with Docker

```bash
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=test \
  -e MINIO_ROOT_PASSWORD=test12345 \
  -v ~/minio-data:/data \
  minio/minio server /data --console-address ":9001"
```

#### Create Bucket via Web UI

1. Open http://localhost:9001
2. Login with `test` / `test12345`
3. Create bucket named `brewfest-dev`

#### Configure Your App

Similar to LocalStack, but use endpoint `http://localhost:9000`

```toml
[env]
AWS_ENDPOINT_URL = "http://localhost:9000"
AWS_ACCESS_KEY_ID = "test"
AWS_SECRET_ACCESS_KEY = "test12345"
```

### Option 3: Real AWS S3 (Development Account)

Use a real AWS S3 bucket with limited permissions.

#### Setup

1. Create AWS account or use existing
2. Create IAM user with S3 permissions
3. Create S3 bucket: `brewfest-dev`
4. Get access keys from IAM console

#### Configure

```toml
[env]
S3_REGION = "us-east-2"
S3_BUCKET = "brewfest-dev"
S3_FOLDER = "images"
AWS_ACCESS_KEY_ID = "your-access-key-id"
AWS_SECRET_ACCESS_KEY = "your-secret-access-key"
```

**Warning**: Never commit real AWS credentials to git!

## Testing the Setup

### 1. Start Your Services

```bash
# Start PostgreSQL (if not already running)
docker-compose up postgres -d

# Start LocalStack or MinIO
docker-compose up localstack -d

# Run migrations
mise run migrate
```

### 2. Start the API Server

```bash
mise run dev
```

### 3. Test Image Upload

```bash
# Create a test image
curl -X POST http://localhost:8080/events/1/vendors/1/inventory/1/thumbnail \
  -H "Authorization: Bearer your-api-key" \
  -F "file=@test-image.jpg"
```

### 4. Verify Upload

**LocalStack:**
```bash
aws --endpoint-url=http://localhost:4566 s3 ls s3://brewfest-dev/images/
```

**MinIO:**
- Check web UI at http://localhost:9001
- Navigate to `brewfest-dev` bucket

## Code Changes Needed for LocalStack/MinIO

The current `images/src/s3.rs` doesn't support custom endpoints. Here's what needs to be modified:

### Update `images/src/s3.rs`

Add endpoint configuration support:

```rust
impl S3 {
    pub fn new() -> Pin<Box<dyn std::future::Future<Output = Result<Self, UploadError>>>>
    where
        Self: Sized,
    {
        Box::pin(async {
            // Check for custom endpoint (LocalStack/MinIO)
            let config_loader = aws_config::from_env();

            let config_loader = if let Ok(endpoint) = std::env::var("AWS_ENDPOINT_URL") {
                config_loader.endpoint_url(endpoint)
            } else {
                config_loader
            };

            let s3_config = config_loader.load().await;
            let client = Arc::new(S3Client::new(&s3_config));

            let bucket_name = std::env::var("S3_BUCKET")
                .map_err(|_| UploadError::EnvVarMissing("S3_BUCKET".to_string()))?;
            let folder_name = std::env::var("S3_FOLDER")
                .map_err(|_| UploadError::EnvVarMissing("S3_FOLDER".to_string()))?;

            Ok(Self {
                client,
                bucket_name,
                folder_name,
            })
        })
    }
}
```

### Update `.mise.toml` for LocalStack

```toml
[env]
# ... existing vars ...

# LocalStack Configuration (uncomment to use)
AWS_ENDPOINT_URL = "http://localhost:4566"
```

## Troubleshooting

### Issue: "Failed to upload image to S3"

**Check:**
1. LocalStack/MinIO is running: `docker ps`
2. Bucket exists: `aws --endpoint-url=http://localhost:4566 s3 ls`
3. Credentials are correct in `.mise.toml`
4. Endpoint URL is set: `echo $AWS_ENDPOINT_URL`

### Issue: "Environment variable S3_BUCKET must be set"

**Solution:** Run with mise to load env vars:
```bash
mise run dev
# NOT: cargo run --features dev
```

### Issue: "Failed to decode image"

**Check:**
- File is a valid image (JPEG, PNG, etc.)
- File is not corrupted
- File size is reasonable (not too large)

### Issue: LocalStack bucket not persisting

**Solution:** Add volume mount in docker-compose:
```yaml
volumes:
  - "./localstack-data:/tmp/localstack"
```

## Security Notes

### For Local Development

- Mock credentials (`test`/`test`) are fine
- LocalStack/MinIO should NOT be exposed to internet
- Use `127.0.0.1` instead of `0.0.0.0` for local services

### For Production

- Use IAM roles on AWS (EC2/ECS) - no credentials needed
- Or use AWS Secrets Manager for credentials
- Never commit `.env` files with real credentials
- Use separate buckets for dev/staging/prod
- Enable bucket versioning and encryption

## Quick Reference

### Start Development Environment

```bash
# All in one
docker-compose up postgres localstack -d && mise run migrate && mise run dev
```

### View LocalStack Logs

```bash
docker logs -f localstack
```

### List Uploaded Images

```bash
aws --endpoint-url=http://localhost:4566 s3 ls s3://brewfest-dev/images/ --recursive
```

### Download an Image

```bash
aws --endpoint-url=http://localhost:4566 s3 cp s3://brewfest-dev/images/uuid.png ./downloaded.png
```

### Delete Test Data

```bash
aws --endpoint-url=http://localhost:4566 s3 rm s3://brewfest-dev/images/ --recursive
```

## Next Steps

1. Choose your local S3 option (LocalStack recommended)
2. Update `images/src/s3.rs` to support custom endpoints
3. Add LocalStack to `docker-compose.yml`
4. Test image uploads
5. Consider adding S3 health check to startup
6. Document your team's preferred setup

## Related Files

- **S3 Implementation:** `images/src/s3.rs`
- **Config:** `images/src/config.rs` (defines S3Config struct)
- **Upload Handler Example:** `web/src/handlers/events/vendor/inventory/thumbnail.rs:18`
- **Environment Config:** `.mise.toml`
- **Legacy Uploader:** `web/src/utils/s3_uploader.rs` (can be removed)
