# Multi-stage build for Next.js app
FROM node:20-alpine AS builder

WORKDIR /app/client

# Copy package files
COPY client/package.json client/bun.lock* ./

# Install dependencies
RUN npm install -g bun && bun install

# Copy client source
COPY client/ ./

# Build Next.js app
RUN bun run build

# Build imaginary from source for multi-arch support
FROM golang:1.21-bookworm AS imaginary-builder

RUN apt-get update && \
    apt-get install -y git libvips-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN git clone --depth 1 --branch v1.2.4 https://github.com/h2non/imaginary.git /tmp/imaginary && \
    cd /tmp/imaginary && \
    go build -o /usr/local/bin/imaginary

# Final image with both services
FROM node:20-bookworm-slim

# Install runtime dependencies (including libvips for imaginary)
RUN apt-get update && \
    apt-get install -y bash ca-certificates curl libvips42 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy imaginary binary from builder
COPY --from=imaginary-builder /usr/local/bin/imaginary /usr/local/bin/imaginary
RUN chmod +x /usr/local/bin/imaginary

# Copy built Next.js app (standalone build)
WORKDIR /app
COPY --from=builder /app/client/.next/standalone ./
COPY --from=builder /app/client/.next/static ./.next/static
COPY --from=builder /app/client/public ./public

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose both ports
EXPOSE 3000 9000

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://localhost:9000
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=20s \
  CMD curl -f http://localhost:3000 && curl -f http://localhost:9000/health

# Start both services
CMD ["/start.sh"]

