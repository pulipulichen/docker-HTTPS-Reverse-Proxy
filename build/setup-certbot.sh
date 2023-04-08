#!/bin/bash

if [ -f "/opt/rp/certbot-init.sh" ]; then
  cp -f /opt/rp/nginx/certbot/nginx.conf /etc/nginx/nginx.conf

  echo "nginx for certbot is starting..."
  service nginx start

  echo "test ngnix..."
  curl http://127.0.0.1
  
  cat /opt/rp/certbot-init.sh
  bash /opt/rp/certbot-init.sh

  echo "nginx for certbot is stoping..."
  service nginx stop
fi

cp -f /opt/rp/nginx/rp/nginx.conf /etc/nginx/nginx.conf