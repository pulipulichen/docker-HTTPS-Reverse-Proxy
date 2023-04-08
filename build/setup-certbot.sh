#!/bin/bash

if [ -f "/opt/rp/nginx/certbot/nginx.conf" ]; then
  cp -f /opt/rp/nginx/certbot/nginx.conf /etc/nginx/nginx.conf

  echo "nginx for certbot is starting..."
  service nginx start

  curl http://127.0.0.1
  # bash /opt/rp/certbot-init.sh
  cat /opt/rp/certbot-init.sh

  echo "nginx for certbot is stoping..."
  service nginx stop
fi

cp -f /opt/rp/nginx/rp/nginx.conf /etc/nginx/nginx.conf