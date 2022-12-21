FROM node:18-alpine3.16

WORKDIR /server

RUN npm i -g npm
RUN npm i -g corepack

CMD yarn install && yarn db-migrate && sh -c 'DEBUG="bot*" yarn dev-start'
