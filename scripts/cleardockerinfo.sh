docker-compose down

docker stop $(docker ps -q) >/dev/null 1>/dev/null 2>/dev/null
docker rm $(docker ps -aq) >/dev/null 1>/dev/null 2>/dev/null

sudo chown -R $USER:$USER ./
yarn
