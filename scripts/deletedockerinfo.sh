docker-compose down

docker stop $(docker ps -q) >/dev/null 1>/dev/null 2>/dev/null
docker rm $(docker ps -aq) >/dev/null 1>/dev/null 2>/dev/null

sudo rm -rf .docker-volumes/postgres_volume
mkdir .docker-volumes/postgres_volume
sudo rm -rf .docker-volumes/redis_volume
mkdir .docker-volumes/redis_volume

sudo rm -r node_modules
sudo chown -R $USER:$USER ./
yarn
