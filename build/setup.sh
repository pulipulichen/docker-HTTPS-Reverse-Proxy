#!/bin/bash

node /opt/rp/setup.js
if [ $? != 0 ]; then
   exit 1
fi

cat /opt/rp/nginx/rp/nginx.conf
cat /opt/rp/certbot-init.sh

exit 64

/opt/rp/setup-certbot.sh
