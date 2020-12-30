# BUILD
FROM node:latest AS build

WORKDIR /usr/src/servicify-frontend

ENV PM2_PUBLIC_KEY 3vzgpwperfkufhf
ENV PM2_SECRET_KEY oer0ullnqq60drb

ARG api="http://localhost:7779"
ARG version="v1"

RUN touch .env && echo "VUE_APP_API_URL=${api}" >> .env && echo "VUE_APP_API_VERISION=${version}" >> .env

# DEVELOPMENT
FROM build as dev
CMD  npm install && npm install pm2 -g && exec pm2 start --no-daemon --watch --ignore-watch "public dist tests Dockerfile" --watch-delay 60 ./node_modules/@vue/cli-service/bin/vue-cli-service.js -- serve

# PRODUCTION
FROM build as prod
COPY package*.json ./
RUN npm install && npm install pm2 -g 
COPY . .
