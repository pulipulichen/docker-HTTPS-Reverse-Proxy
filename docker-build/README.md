# Dockerhub

- https://docs.docker.com/get-started/04_sharing_app/
- https://hub.docker.com/
- `docker image ls | head` 找出合適的名稱，例如「docker-https-reverse-proxy」
- 建立合適的repo https://hub.docker.com/
- `docker tag docker-https-reverse-proxy-rp pudding/docker-https-reverse-proxy:20230924-2113`
- `docker push pudding/docker-https-reverse-proxy:20230924-2113`
- 修改Dockerfile 

````
FROM pudding/docker-https-reverse-proxy:20230924-2113
````