FROM node:18-alpine

RUN apk update && apk add --no-cache nginx
RUN mkdir -p /run/nginx

ARG NEXT_PUBLIC_STRIPE_PUBLIC_KEY

WORKDIR /app
COPY ./frontend ./frontend
COPY ./backend ./backend
COPY nginx/initial.conf /etc/nginx/nginx.conf
COPY nginx/final.conf /etc/nginx/final.conf
COPY entrypoint.sh /entrypoint.sh

ENV NEXT_PUBLIC_STRIPE_PUBLIC_KEY=${NEXT_PUBLIC_STRIPE_PUBLIC_KEY}

WORKDIR /app/frontend
RUN npm install && npm run build

WORKDIR /app/backend
RUN npm install && npm run build

RUN chmod +x /entrypoint.sh

EXPOSE 10000

ENTRYPOINT ["/entrypoint.sh"]
