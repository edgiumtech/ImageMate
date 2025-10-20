#!/bin/bash
set -e

# Default ports (can be overridden via environment variables)
FRONTEND_PORT=${FRONTEND_PORT:-3000}
BACKEND_PORT=${BACKEND_PORT:-9000}

echo "Starting Imaginary backend on port ${BACKEND_PORT}..."
# Start imaginary in the background (unset PORT to avoid conflicts)
(unset PORT && /usr/local/bin/imaginary \
  -concurrency 10 \
  -enable-url-source \
  -http-cache-ttl 31556926 \
  -cpus 2 \
  -cors \
  -p ${BACKEND_PORT}) &

IMAGINARY_PID=$!

# Wait for imaginary to be ready
echo "Waiting for Imaginary to be ready..."
sleep 3

echo "Starting Next.js frontend on port ${FRONTEND_PORT}..."
# Start Next.js app (standalone server)
cd /app
export PORT=${FRONTEND_PORT}
export HOSTNAME="0.0.0.0"
export BACKEND_URL="http://localhost:${BACKEND_PORT}"
NODE_ENV=production node server.js &
NEXTJS_PID=$!

echo "✅ Both services are running!"
echo "Frontend: http://localhost:${FRONTEND_PORT}"
echo "Backend: http://localhost:${BACKEND_PORT}"

# Function to handle shutdown
shutdown() {
  echo "Shutting down services..."
  kill $NEXTJS_PID $IMAGINARY_PID 2>/dev/null
  exit 0
}

# Trap signals
trap shutdown SIGTERM SIGINT

# Wait for both processes
wait $IMAGINARY_PID $NEXTJS_PID

