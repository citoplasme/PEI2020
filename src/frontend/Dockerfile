# BUILD
FROM node:latest AS build

WORKDIR /usr/src/servicify-frontend

ENV PM2_PUBLIC_KEY 3vzgpwperfkufhf
ENV PM2_SECRET_KEY oer0ullnqq60drb

# DEVELOPMENT
FROM build as dev
CMD  npm install && npm install pm2 -g && exec pm2 start --no-daemon --watch --ignore-watch "public dist tests Dockerfile" --watch-delay 60 ./node_modules/@vue/cli-service/bin/vue-cli-service.js -- serve

# PRODUCTION
FROM build as prod-build
COPY package*.json ./
COPY . .
RUN npm install && npm install pm2 -g && npm run build


FROM nginx as prod
RUN mkdir /frontend
COPY --from=prod-build /usr/src/servicify-frontend/dist /frontend
COPY confs/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
