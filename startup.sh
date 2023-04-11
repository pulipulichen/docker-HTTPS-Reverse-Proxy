#!/bin/bash

cd "$(dirname "$0")"

if [ ! -f ./conf/backends.yml ]; then
  cp ./conf/backends.sample.yml ./conf/backends.yml
fi

if [ ! -f ./conf/nginx/conf.template ]; then
  cp ./conf/nginx/conf.sample.template ./conf/nginx/conf.template
fi

if [ ! -f ./conf/nginx/http-server.template ]; then
  cp ./conf/nginx/http-server.sample.template ./conf/nginx/http-server.template
fi

if [ ! -f ./conf/nginx/https-server.template ]; then
  cp ./conf/nginx/https-server.sample.template ./conf/nginx/https-server.template
fi

if [ ! -f ./conf/nginx/server.template ]; then
  cp ./conf/nginx/server.sample.template ./conf/nginx/server.template
fi

sudo docker-compose build
sudo docker-compose stop
sudo docker-compose up --build