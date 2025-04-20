docker build -t iotwebapp-backend-admin .
docker run -itd  --name=iotwebapp-backend-admin -p 8083:8083  iotwebapp-backend-admin

docker build --no-cache -t iotwebapp-backend-admin .
docker builder prune
docker system prune -a

docker build -t iotwebapp-backend .
docker run -itd  --name=iotwebapp-backend -p 8083:8083  iotwebapp-backend

docker exec -it influxdb1 sh
