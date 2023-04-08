#!/bin/bash

if [ ! -f ./docker-compose.yml ]; then
  cp ./docker-compose.sample.yml ./docker-compose.yml
fi

# if [ ! -f ./conf/nginx/nginx-http.conf ]; then
#   cp ./conf/nginx/nginx-http.sample.conf ./conf/nginx/nginx-http.conf
# fi

# if [ ! -f ./conf/nginx/nginx-https.conf ]; then
#   cp ./conf/nginx/nginx-https.sample.conf ./conf/nginx/nginx-https.conf
# fi

sudo docker-compose up --build