FROM node:lts-alpine

WORKDIR /server

RUN npm i -g npm
RUN npm i -g corepack

CMD yarn install && yarn db-migrate && yarn build && && sh -c 'DEBUG="bot*" yarn prod --post-slash-commands=true'
