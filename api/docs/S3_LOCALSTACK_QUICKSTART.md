# LocalStack S3 Quick Start Guide

## What You Have Now

✅ **LocalStack running in Docker** - S3-compatible storage on `localhost:4566`
✅ **S3 bucket created** - `brewfest-dev` bucket ready to use
✅ **Code updated** - `images/src/s3.rs` now supports custom endpoints
✅ **Environment configured** - `.mise.toml` has all required variables

## Starting Your Development Environment

### 1. Start All Services

```bash
# Start PostgreSQL and LocalStack
docker-compose up -d

# Wait a few seconds for LocalStack to be ready
sleep 5

# Create the S3 bucket (only needed first time or after volume reset)
AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test \
  aws --endpoint-url=http://localhost:4566 --region us-east-1 \
  s3 mb s3://brewfest-dev
```

### 2. Run Migrations

```bash
mise run migrate
```

### 3. Start Your API

```bash
mise run dev
```

Your API will now upload images to LocalStack instead of AWS!

## Verify LocalStack is Working

Check if LocalStack is running:

```bash
docker ps | grep localstack
```

Check LocalStack health:

```bash
curl http://localhost:4566/_localstack/health | jq
```

List S3 buckets:

```bash
AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test \
  aws --endpoint-url=http://localhost:4566 --region us-east-1 s3 ls
```

## Testing Image Upload

### 1. Create a Test Image

```bash
# Create a simple test image (requires ImageMagick)
convert -size 100x100 xc:blue test-image.png

# Or just use any existing image
```

### 2. Upload via API

```bash
curl -X POST http://localhost:8080/events/1/vendors/1/inventory/1/thumbnail \
  -H "Authorization: Bearer your-api-key" \
  -F "file=@test-image.png"
```

### 3. Verify Upload in LocalStack

```bash
# List files in the images folder
AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test \
  aws --endpoint-url=http://localhost:4566 --region us-east-1 \
  s3 ls s3://brewfest-dev/images/

# Download an uploaded image to verify
AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test \
  aws --endpoint-url=http://localhost:4566 --region us-east-1 \
  s3 cp s3://brewfest-dev/images/SOME-UUID.png ./downloaded.png
```

## Environment Variables

Your `.mise.toml` now has:

```toml
[env]
# S3 Configuration
S3_REGION = "us-east-2"
S3_BUCKET = "brewfest-dev"
S3_FOLDER = "images"

# AWS Credentials (mock for LocalStack)
AWS_ACCESS_KEY_ID = "test"
AWS_SECRET_ACCESS_KEY = "test"
AWS_ENDPOINT_URL = "http://localhost:4566"
```

**Important:** Always run with `mise run dev` to load these variables!

## Common Commands

### AWS CLI with LocalStack

Create an alias to simplify commands:

```bash
# Add to your ~/.bashrc or ~/.zshrc
alias awslocal='AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test aws --endpoint-url=http://localhost:4566 --region us-east-1'
```

Then use:

```bash
awslocal s3 ls s3://brewfest-dev/images/
awslocal s3 cp test.png s3://brewfest-dev/images/test.png
awslocal s3 rm s3://brewfest-dev/images/test.png
```

### Docker Commands

```bash
# View LocalStack logs
docker logs -f api-localstack-1

# Restart LocalStack
docker-compose restart localstack

# Stop everything
docker-compose down

# Remove volumes (resets data)
docker-compose down -v
```

## Switching Between LocalStack and Real AWS

### For Local Development (LocalStack)

Use `mise run dev` - it automatically uses LocalStack via `.mise.toml`.

### For Production (Real AWS)

Remove or comment out `AWS_ENDPOINT_URL` from environment:

```bash
# Production environment should NOT have:
# AWS_ENDPOINT_URL = "http://localhost:4566"

# Instead use real AWS credentials
export AWS_ACCESS_KEY_ID=your-real-key
export AWS_SECRET_ACCESS_KEY=your-real-secret
export S3_REGION=us-east-2
export S3_BUCKET=brewfest-prod
export S3_FOLDER=images
```

## Troubleshooting

### Issue: "Failed to upload image to S3"

**Check LocalStack logs:**
```bash
docker logs api-localstack-1 --tail 50
```

**Verify bucket exists:**
```bash
AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test \
  aws --endpoint-url=http://localhost:4566 --region us-east-1 s3 ls
```

**Recreate bucket if missing:**
```bash
AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test \
  aws --endpoint-url=http://localhost:4566 --region us-east-1 \
  s3 mb s3://brewfest-dev
```

### Issue: "Environment variable S3_BUCKET must be set"

You're not running with mise. Always use:
```bash
mise run dev  # ✓ Correct
cargo run     # ✗ Wrong - doesn't load .mise.toml env vars
```

### Issue: "Connection refused" to port 4566

LocalStack isn't running. Start it:
```bash
docker-compose up localstack -d
```

### Issue: Bucket persists but files are lost after restart

This is expected with LocalStack free version. Files are stored in Docker volume `api_localstack_data` but may not persist perfectly. For production, use real S3.

To keep data between restarts, the `PERSISTENCE=1` environment variable in docker-compose should help.

## What Changed in Your Code

### `images/src/s3.rs`

Added support for custom endpoints:

```rust
// Support custom endpoints for LocalStack/MinIO
let config_loader = aws_config::defaults(aws_config::BehaviorVersion::latest());

let config_loader = if let Ok(endpoint) = std::env::var("AWS_ENDPOINT_URL") {
    info!("Using custom S3 endpoint: {}", endpoint);
    config_loader.endpoint_url(endpoint)
} else {
    config_loader
};
```

When `AWS_ENDPOINT_URL` is set, the S3 client uses LocalStack instead of real AWS!

### `docker-compose.yml`

Added LocalStack service:

```yaml
localstack:
  image: localstack/localstack:4.12.0
  ports:
    - "4566:4566"
  environment:
    - SERVICES=s3
    - DEBUG=1
    - PERSISTENCE=1
  volumes:
    - "localstack_data:/var/lib/localstack"
```

## Next Steps

1. **Test the complete flow:**
   - Start services: `docker-compose up -d`
   - Run API: `mise run dev`
   - Upload an image via your API endpoint
   - Verify it appears in LocalStack

2. **Optional: Install awslocal wrapper:**
   ```bash
   pip install awscli-local
   # Then use: awslocal s3 ls (no need for endpoint URL)
   ```

3. **Consider adding a startup script** that checks if the bucket exists and creates it automatically

4. **Update your API documentation** to mention S3 upload endpoints

## Resources

- [LocalStack Docs](https://docs.localstack.cloud/)
- [AWS SDK for Rust](https://docs.aws.amazon.com/sdk-for-rust/latest/dg/welcome.html)
- Your detailed guide: `docs/S3_LOCAL_DEVELOPMENT.md`
