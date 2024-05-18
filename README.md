[![DOI](https://zenodo.org/badge/624196765.svg)](https://zenodo.org/doi/10.5281/zenodo.11214011)

# docker-HTTPS-Reverse-Proxy

This is a Docker server configured with an Nginx reverse proxy server, which includes built-in functionality to automatically apply for certificates from Let's Encrypt, allowing it to add HTTPS protocol to backend servers.

這是一個以Nginx反向代理伺服器構成的Docker伺服器，並且內建了自動跟Let's Encrypt申請憑證的功能，能夠為後端伺服器加上HTTPS協定。

## Technologies

- **Docker** 虛擬化技術
- **Nginx** 網頁伺服器兼反向代理伺服器
- **certbot** 憑證申請工具

![](https://blogger.googleusercontent.com/img/a/AVvXsEiS2eJu_QGYTs-IdaUKFqKjcrgIgIXtoD1w9J5VUuP8VWUhd6sqHao_d3F5fmCwhdLMjDwbfxIZtI9S5awlV_fox8IKjKOfxzoVup8_GbFS6aGP3xCaVFFVMkYPlvjBz3IcMFXoIAZ5yx1L2e41TFgtK4GTOlDJpek99roQ0obsfCDGv5MuKis-lg)

## Features

- Reverse proxy: Setup a frontend before your real server.
- Loading balancing: You can server multiple backends with a domain name.
- Proxy cache and gzip compression: JavaScript, CSS, images, audio and video files will be cached and compressed automatically.
- Avoid server header information disclosure. Headers like "Server" and "X-Powered-By" will be removed automatically. Error page is also customised to hide the server information.
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

## Citation

Chen, Y.-T. (2024). _Docker-HTTPS-Reverse-Proxy_ (0.9.0) \[JavaScript\]. [https://github.com/pulipulichen/docker-HTTPS-Reverse-Proxy](https://github.com/pulipulichen/docker-HTTPS-Reverse-Proxy) (Original work published 2023)