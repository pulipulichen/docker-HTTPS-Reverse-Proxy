#!/bin/bash

if [ -f "/opt/rp/nginx/certbot/nginx.conf"]; then
  while :
  do
    sleep 2592000
    #sleep 10

    # https://stackoverflow.com/a/22010339
    {
      # 先把nginx環境準備好
      cp -f /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
      cp -f /opt/rp/nginx/certbot/nginx.conf /etc/nginx/nginx.conf
      /etc/init.d/nginx reload

      echo "certbot update..."
      #/usr/bin/certbot renew --dry-run
      /usr/bin/certbot renew

      cp -f /etc/nginx/nginx.conf.backup /etc/nginx/nginx.conf
      /etc/init.d/nginx reload
    } || {
      echo "Error"
    }
  done
fi