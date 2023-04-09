#!/bin/bash

if [ -f ./conf/nginx/conf.template ]; then
  rm -f ./conf/nginx/conf.template
fi

if [ -f ./conf/nginx/http-server.template ]; then
  rm -f  ./conf/nginx/http-server.template
fi

if [ -f ./conf/nginx/https-server.template ]; then
  rm -f  ./conf/nginx/https-server.template
fi

if [ -f ./conf/nginx/server.template ]; then
  rm -f  ./conf/nginx/server.template
fi