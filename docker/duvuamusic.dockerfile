FROM openjdk:17

WORKDIR /var/bot/

COPY duvua-bot-music.jar /var/bot/duvua-bot-music.jar

CMD java -jar duvua-bot-music.jar
