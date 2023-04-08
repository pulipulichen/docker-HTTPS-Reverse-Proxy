#!/bin/sh

# sed 's/{{ RP_BACKEND }}/new-text/g' source.txt > output.txt

if [ -z "${RP_BACKEND}" ]; then
  echo "Environment variable \"RP_BACKEND\" is empty." 1>&2
  exit 64
fi

if [ -z "${RP_DOMAIN_NAME}" ]; then
  echo "Environment variable \"RP_DOMAIN_NAME\" is empty. Only reverse proxy work." 1>&2
else
  CERTBOT_DIR=/etc/letsencrypt/accounts
  if [ -d "$CERTBOT_DIR" ]; then
    echo "Certbot is initialized."
  else
    # 確認domain能不能解析

    # 建立ngnix預設值
    # 執行certbot
    #DOMAIN=blog.pulipuli.info

    CERTBOT_DOMAIN=
    NSLOOKUP=`nslookup $RP_DOMAIN_NAME | grep "server can't find"`
    if [ -z "${NSLOOKUP}" ]; then
      echo "${RP_DOMAIN_NAME} is registered."

      PING=`ping -c 1 $RP_DOMAIN_NAME | grep "1 received"`
      #echo $PING
      if [ -z "${PING}" ]; then
        echo "Set CERTBOT as ${RP_DOMAIN_NAME}"
        CERTBOT_DOMAIN="$RP_DOMAIN_NAME"
      else
        echo "${RP_DOMAIN_NAME} is running. Please stop it before registering SSL Cert."
      fi
    else
      echo "${RP_DOMAIN_NAME} is not registered."
    fi

    #echo $CERTBOT_DOMAIN
    if [ -z "${CERTBOT_DOMAIN}" ]; then
      # 表示有註冊，但PING不到。

      # 先準備好 nginx-certbot.conf
      rm -f /etc/nginx/nginx.conf
      cp /opt/rp/nginx-certbot.conf /etc/nginx/nginx.conf

      # 開啟 nginx
      service nginx start

      # 開啟 certbot
      # curl http://127.0.0.1
      RP_EMAIL=`/tmpmail --generate`
      echo $RP_EMAIL
      /usr/bin/certonly --webroot -w /var/www/certbot --force-renewal --email $RP_EMAIL -d $CERTBOT_DOMAIN --agree-tos

      # 等待驗證成功
      service nginx stop
    fi
  fi

fi

# https://www.cyberciti.biz/faq/how-to-use-sed-to-find-and-replace-text-in-files-in-linux-unix-shell/
if [ -z "${RP_DOMAIN_NAME}" ]; then
  sed 's/${RP_BACKEND}/$RP_BACKEND/g' /etc/nginx/nginx-http-template.conf  >> /etc/nginx/nginx.conf  
else
  sed -e 's/${RP_DOMAIN}/$CERTBOT_DOMAIN/g' -e 's/${RP_BACKEND}/$RP_BACKEND/g' /etc/nginx/nginx-https-template.conf  >> /etc/nginx/nginx.conf
fi

echo /etc/nginx/nginx.conf

/docker-entrypoint.sh
