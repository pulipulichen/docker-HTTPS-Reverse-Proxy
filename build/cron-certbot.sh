#!/bin/bash

#while :
#do
  #sleep 2592000
  sleep 10

  # 先把nginx環境準備好
  cp -f /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
  cp -f /opt/rp/nginx-certbot.conf /etc/nginx/nginx.conf
  /etc/init.d/nginx reload

  echo "certbot update..."
  /usr/bin/certbot renew --dry-run

  cp -f /etc/nginx/nginx.conf.backup /etc/nginx/nginx.conf
  /etc/init.d/nginx reload
#done