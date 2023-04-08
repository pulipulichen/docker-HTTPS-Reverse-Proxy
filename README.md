# docker-HTTPS-Reverse-Proxy
Nginx Reverse Proxy with HTTPS via LetsEncrypt and update certification regularly.

## Features

- Reverse proxy: Setup a frontend before your real server.
- Proxy cache: JavaScript, CSS, images, audio and video files will be cached automatically.
- PageSpeed compression: Use "OptimizeForBandwidth" rules. For more information: https://shazi.info/nginx-%E5%B0%88%E6%B3%A8%E6%96%BC-cdn-%E7%9A%84-pagespeed-module/ 




## How to Use

1. `git clone`
2. Set up configuration in `docker-compose.yml` .
3. `startup.sh` .

## Configuration

- ./docker-compose.yml
- ./config/nginx/nginx-http.conf
- ./config/nginx/nginx-https.conf

