FROM node:lts-alpine

WORKDIR /server

RUN npm i -g npm
RUN npm i -g corepack

CMD yarn install && yarn db-migrate && sleep 3 && sh -c 'DEBUG="bot*" yarn dev --post-slash-commands=true'
