# BUILD
FROM node:latest AS build

WORKDIR /usr/src/servicify-backend

ENV PM2_PUBLIC_KEY 3vzgpwperfkufhf
ENV PM2_SECRET_KEY oer0ullnqq60drb
ENV MONGODB mongo

ARG port=7779
ARG ip=localhost
ARG swagger=localhost:7779
ENV IP ${ip}
ENV PORT ${port}
ENV SWAGGER_URL ${swagger}

# DEVELOPMENT
FROM build as dev
CMD npm install && npm install pm2 -g && exec pm2 start --watch --no-daemon --ignore-watch "public node_modules logs Dockerfile bin" --watch-delay 60 ./bin/www
 
# PRODUCTION
FROM build AS prod
COPY package*.json ./
RUN npm install && npm install pm2 -g && npm update
COPY . .
EXPOSE 7779
CMD [ "pm2-runtime","./bin/www" ]