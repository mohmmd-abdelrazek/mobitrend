#!/bin/sh
wait_for_service() {
  SERVICE_HOST=$1
  SERVICE_PORT=$2
  echo "Waiting for ${SERVICE_HOST}:${SERVICE_PORT} to be ready..."
  while ! nc -z ${SERVICE_HOST} ${SERVICE_PORT}; do
    sleep 0.5
  done
  echo "${SERVICE_HOST}:${SERVICE_PORT} is up and running."
}

echo "Starting Nginx with the initial configuration..."
nginx -g 'daemon off;' &

echo "Starting backend service..."
cd /app/backend
npm run start &

echo "Starting frontend service..."
cd /app/frontend
npm run start &

wait_for_service localhost 3000
wait_for_service localhost 5000

echo "Reloading Nginx..."
cp /etc/nginx/final.conf /etc/nginx/nginx.conf
nginx -s reload

echo "service is up and running."
wait