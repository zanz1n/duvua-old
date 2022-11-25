FROM node:lts-alpine

WORKDIR /server

COPY ./dist/ /server/dist
COPY ./package.json /server/
COPY ./yarn.lock /server/
COPY ./prisma/ /server/prisma

RUN yarn install

CMD ls -la /server/ && node dist/index.js
