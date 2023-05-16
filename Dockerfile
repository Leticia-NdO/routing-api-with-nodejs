FROM node:16

WORKDIR /usr/app/routing-api

COPY ./ .

RUN npm run build