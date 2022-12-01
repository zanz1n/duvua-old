FROM openjdk:13

WORKDIR /server

COPY ./docker/lavalink-config.yml /server/application.yml
COPY ./docker/Lavalink.jar /server/Lavalink.jar

EXPOSE 2333

CMD java -Xmx${LAVALINK_MAX_MEMORY} -Xms${LAVALINK_MIN_MEMORY} -jar Lavalink.jar