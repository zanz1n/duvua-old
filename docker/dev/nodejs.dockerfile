FROM node:lts-alpine

WORKDIR /server

RUN npm i -g npm
RUN npm i -g corepack

CMD yarn install && yarn db-migrate && sh -c 'DEBUG="bot*" yarn dev-start'
