FROM node:23.11.0-bullseye-slim as runtime
LABEL authors="osirys"

ENV APP_DIR=/app
WORKDIR ${APP_DIR}

COPY package.json package-lock.json ./
RUN npm ci

COPY . ${APP_DIR}

EXPOSE 3000
