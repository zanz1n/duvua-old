FROM eclipse-temurin:17-jdk-alpine AS builder

RUN apk add maven

WORKDIR /build

COPY ./music /build

RUN mvn package

FROM eclipse-temurin:17-jdk-alpine

WORKDIR /bot

RUN apk add openssl

COPY --from=builder /build/target/duvua-bot-music-1.0-jar-with-dependencies.jar /bot/duvua-music.jar

CMD java -jar duvua-music.jar
