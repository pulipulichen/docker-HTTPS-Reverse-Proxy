# docker-HTTPS-Reverse-Proxy
Nginx Reverse Proxy with HTTPS via LetsEncrypt and update certification regularly.

## Features

- Reverse proxy: Setup a frontend before your real server.
- Loading balanced: You can server multiple backends with a domain name.
- Proxy cache and gzip compression: JavaScript, CSS, images, audio and video files will be cached and compressed automatically.
- Request limitation by IP address and short time brust: Prevent DDoS.
- SSL certicate request and renew automatically.
- Virtual host: support Apache VirtualHost backends.

## How to Use

1. `git clone https://github.com/pulipulichen/docker-HTTPS-Reverse-Proxy.git`
2. Set up configuration in `/conf/backends.yml`.
3. `./startup.sh` .

## Configuration

- ./docker-compose.yml
- ./conf/nginx/conf.template
- ./conf/nginx/http-server.template
- ./conf/nginx/https-server.template
- ./conf/nginx/server.template

## YAML Playground

https://eemeli.org/yaml-playground/