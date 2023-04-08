#!/bin/bash

if [ ! -f ./docker-compose.yml ]; then
  cp ./docker-compose.sample.yml ./docker-compose.yml
fi

if [ ! -f ./config/nginx/nginx-http.conf ]; then
  cp ./conf/nginx/nginx-http.sample.conf ./config/nginx/nginx-http.conf
fi

if [ ! -f ./config/nginx/nginx-https.conf ]; then
  cp ./conf/nginx/nginx-https.sample.conf ./config/nginx/nginx-https.conf
fi

sudo docker-compose up --build