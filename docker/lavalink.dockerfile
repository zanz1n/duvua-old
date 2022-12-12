FROM eclipse-temurin:18-jre-alpine

WORKDIR /server

COPY ./lavalink-config.yml /server/application.yml
COPY ./Lavalink.jar /server/Lavalink.jar

RUN apk update
RUN apk add ffmpeg
RUN apk add --no-cache libstdc++ gcompat
RUN mkdir /root/jvm-tmp

EXPOSE 2333

CMD java -Xmx${LAVALINK_MAX_MEMORY} -Xms${LAVALINK_MIN_MEMORY} -Djava.io.tmpdir=/root/jvm-tmp -jar Lavalink.jar