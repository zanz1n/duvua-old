FROM node:lts-alpine3.16 AS builder

WORKDIR /build

RUN npm i -g pnpm

COPY ./main/package.json ./main/tsconfig.json /build/main/

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml /build/

RUN pnpm install --frozen-lockfile

COPY ./main/prisma/ /build/main/prisma
COPY ./main/src/ /build/main/src

RUN pnpm --filter main db:generate
RUN pnpm build:main

FROM node:lts-alpine3.16

WORKDIR /bot

COPY ./main/docker-cmd.sh /docker-cmd.sh
RUN chmod +x /docker-cmd.sh

RUN npm i -g pnpm

RUN apk add openssl

COPY --from=builder /build/package.json /build/pnpm-lock.yaml /build/pnpm-workspace.yaml /bot/
COPY --from=builder /build/main/package.json /build/main/tsconfig.json /bot/main/
COPY --from=builder /build/main/prisma /bot/main/prisma

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /build/main/dist /bot/main/dist

RUN pnpm --filter main db:generate

CMD ["/bin/sh", "/docker-cmd.sh"]
