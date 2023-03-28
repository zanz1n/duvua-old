FROM node:lts-alpine3.16 AS build

WORKDIR /build

RUN npm i -g pnpm

COPY ./package.json /build/package.json
COPY ./pnpm-lock.yaml /build/pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

COPY ./tsconfig.json /build/tsconfig.json
COPY ./prisma/ /build/prisma
COPY ./src/ /build/src

RUN pnpm build

FROM node:lts-alpine3.16

WORKDIR /bot

RUN npm i -g pnpm

RUN apk add openssl

COPY --from=build /build/package.json /bot/package.json
COPY --from=build /build/pnpm-lock.yaml /bot/pnpm-lock.yaml
COPY --from=build /build/prisma /bot/prisma

RUN pnpm install --frozen-lockfile --prod

COPY --from=build /build/dist /bot/dist

CMD [ "node", "dist/index.js" ]
