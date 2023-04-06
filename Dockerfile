FROM nginx:1.23.4-bullseye-perl

RUN apt-get update
RUN apt-get install -y certbot

# https://ithelp.ithome.com.tw/articles/10293218
RUN apt-get install -y cron
COPY ./build/cronjob /etc/cron.d/

COPY ./build/docker-entrypoint.sh /opt/rp/docker-entrypoint.sh
ENTRYPOINT ["/opt/rp/docker-entrypoint.sh"]