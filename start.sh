#!/bin/bash
set -e

echo "Starting Imaginary backend..."
# Start imaginary in the background (unset PORT to avoid conflicts)
(unset PORT && /usr/local/bin/imaginary \
  -concurrency 10 \
  -enable-url-source \
  -http-cache-ttl 31556926 \
  -cpus 2 \
  -cors \
  -p 9000) &

IMAGINARY_PID=$!

# Wait for imaginary to be ready
echo "Waiting for Imaginary to be ready..."
sleep 3

echo "Starting Next.js frontend..."
# Start Next.js app (standalone server)
cd /app
export PORT=3000
NODE_ENV=production node server.js &
NEXTJS_PID=$!

echo "✅ Both services are running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:9000"

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

