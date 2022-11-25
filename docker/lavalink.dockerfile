FROM openjdk:13

WORKDIR /server

RUN curl https://github.com/freyacodes/Lavalink/releases/download/3.6.2/Lavalink.jar --output /server/Lavalink.jar

CMD java -Xmx1024M -Xms128M -jar Lavalink.jar