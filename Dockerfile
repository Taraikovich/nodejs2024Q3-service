FROM node:22-alpine

WORKDIR /usr/app/src

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]
