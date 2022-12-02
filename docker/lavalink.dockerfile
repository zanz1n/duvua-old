FROM openjdk:13-alpine

WORKDIR /server

COPY ./docker/lavalink-config.yml /server/application.yml
COPY ./docker/Lavalink.jar /server/Lavalink.jar

RUN apk update
RUN apk add ffmpeg
RUN apk add --no-cache libstdc++ gcompat

EXPOSE 2333

CMD java -Xmx${LAVALINK_MAX_MEMORY} -Xms${LAVALINK_MIN_MEMORY} -jar Lavalink.jar