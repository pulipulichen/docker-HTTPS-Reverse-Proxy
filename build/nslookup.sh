DOMAIN=blog.pulipuli.info

CERTBOT_DOMAIN=
NSLOOKUP=`nslookup $DOMAIN | grep "server can't find"`
if [ -z "${NSLOOKUP}" ]; then
  echo "${DOMAIN} is registered."

  PING=`ping -c 1 $DOMAIN | grep "1 received"`
  #echo $PING
  if [ -z "${PING}" ]; then
    echo "Set CERTBOT as ${DOMAIN}"
    CERTBOT_DOMAIN="$DOMAIN"
  else
    echo "${DOMAIN} is running. Please stop it before registering SSL Cert."
  fi
else
  echo "${DOMAIN} is not registered."
fi

echo $CERTBOT_DOMAIN
