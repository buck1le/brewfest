# syntax = docker/dockerfile:1.4

# Use the same Debian version for both builder and runtime to avoid GLIBC mismatch
FROM rust:1.83-bookworm AS builder

WORKDIR /app

# Install necessary packages for OpenSSL and pkg-config
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy only Cargo.toml and Cargo.lock first to leverage Docker layer caching
COPY Cargo.toml Cargo.lock ./

# Copy workspace member manifests
COPY src ./src
COPY web/Cargo.toml ./web/
COPY migration/Cargo.toml ./migration/
COPY images/Cargo.toml ./images/
COPY entities/Cargo.toml ./entities/
COPY notifications/Cargo.toml ./notifications/

# Pre-build dependencies (to cache them)
RUN cargo build --release || true

# Copy the rest of the source code
COPY . .

# Build the application
RUN cargo build --release

# Use Debian Bookworm (same as builder) to match GLIBC versions
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create config directory for FCM credentials
RUN mkdir -p /app/config

# Copy the compiled binary from the builder stage
COPY --from=builder /app/target/release/brew-fest-api .

EXPOSE 8080
EXPOSE 443

CMD ["./brew-fest-api"]
