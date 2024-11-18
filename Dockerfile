FROM node:22-alpine

WORKDIR /usr/app/src

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 4000
