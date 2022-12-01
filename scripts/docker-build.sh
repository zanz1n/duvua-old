sudo chown -R $USER:$USER ./
rm ./docker/Lavalink.jar >/dev/null 1>/dev/null 2>/dev/null;
curl https://github.com/freyacodes/Lavalink/releases/download/3.6.2/Lavalink.jar -o ./docker/Lavalink.jar;
docker-compose build;
