FROM node:lts-alpine

WORKDIR /server

COPY ./src/ /server/src
COPY ./package.json /server/
COPY ./yarn.lock /server/
COPY ./prisma/ /server/prisma

RUN yarn install
RUN yarn build

CMD node dist/index.js
