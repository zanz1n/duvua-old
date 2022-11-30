FROM openjdk:13

WORKDIR /server

COPY ./docker/lavalink-config.yml /server/application.yml
COPY ./docker/Lavalink.jar /server/Lavalink.jar

EXPOSE 2333

CMD java -Xmx1024M -Xms128M -jar Lavalink.jar