docker-compose down

docker stop $(docker ps -q) >/dev/null 1>/dev/null 2>/dev/null
docker rm $(docker ps -aq) >/dev/null 1>/dev/null 2>/dev/null

sudo rm -r node_modules
sudo chown -R izanr:izanr ./
yarn
