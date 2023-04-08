# https://hub.docker.com/layers/library/nginx/1.23.4-bullseye-perl/images/sha256-85d0eaac3c90ccb73feb2aceb636f22080e9dfcdd2c8e04b91716bd4241ec6e0?context=explore
# FROM nginx:1.23.4-bullseye-perl
#FROM anroe/nginx-headers-more:1.22.1-headers-more-v0.34
FROM phpdockerio/nginx-pagespeed:latest

RUN apt-get update
RUN apt-get install -y certbot iputils-ping cron
RUN apt-get install -y curl

# https://tomme.me/nginx-proxy-cache-server/
RUN mkdir -p /tmp/nginx/cache

# RUN chmod +x /opt/rp/docker-entrypoint.sh
# ENTRYPOINT ["/opt/rp/docker-entrypoint.sh"]
#ENTRYPOINT ["/docker-entrypoint-rp.sh"]

# =============

# https://www.makeuseof.com/generate-temporary-email-addresses-using-linux-command-line/
RUN curl -L "https://git.io/tmpmail" > tmpmail && chmod +x tmpmail

RUN mkdir -p /opt/rp/
COPY ./build/nginx-certbot.conf /opt/rp/nginx-certbot.conf

# =============

RUN apt-get install dnsutils -y
RUN apt-get install jq w3m xclip -y

# https://ithelp.ithome.com.tw/articles/10293218
#RUN apt-get install -y cron
# COPY ./build/cronjob /etc/cron.d/
# RUN chmod 0644 /etc/cron.d/cronjob
# RUN crontab /etc/cron.d/cronjob
# RUN apt-get install -y python3-pip
# RUN pip3 install python-crontab

RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash -
RUN apt-get update && apt-get install -y yarn nodejs
RUN npm -v

RUN mkdir -p /etc/nginx/html/
RUN echo "certbot" > /etc/nginx/html/index.html

#RUN apt-get install -y libnginx-mod-http-headers-more-filter
RUN apt-get install -y nginx-extras
#RUN apt-get install nginx-plus-module-headers-more

# COPY ./build/setup-nginx-config.py /opt/rp/

#COPY ./build/cron.py /opt/rp/
COPY ./build/cron-certbot.sh /opt/rp/

RUN mkdir -p /opt/rp/nginx/certbot
COPY ./build/nginx-certbot.conf /opt/rp/
# COPY ./build/nginx/certbot/http-server.template /opt/rp/nginx/certbot
# COPY ./build/nginx/certbot/http-server.template /opt/rp/nginx/certbot
# COPY ./build/nginx/nginx-start.sh /opt/rp/nginx/
# COPY ./build/nginx/nginx-stop.sh /opt/rp/nginx/
COPY ./build/setup-certbot.sh /opt/rp/
RUN chmod +x /opt/rp/*.sh

RUN mkdir -p /opt/local/html
RUN echo 'false' > /opt/local/html/404.html

COPY ./build/setup.js /opt/rp/

# RUN mkdir -p /opt/rp
COPY ./build/setup.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/*.sh
