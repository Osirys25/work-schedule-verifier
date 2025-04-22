FROM node:23.11.0-bullseye-slim as runtime
LABEL authors="osirys"

COPY package.json package-lock.json ./
RUN npm ci

EXPOSE 3000
