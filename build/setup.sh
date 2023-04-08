#!/bin/bash

node /opt/rp/setup.js
if [ $? != 0 ]; then
   exit 1
fi

/opt/rp/setup-certbot.sh
