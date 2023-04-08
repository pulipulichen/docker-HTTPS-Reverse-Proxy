# https://hub.docker.com/layers/library/nginx/1.23.4-bullseye-perl/images/sha256-85d0eaac3c90ccb73feb2aceb636f22080e9dfcdd2c8e04b91716bd4241ec6e0?context=explore
FROM nginx:1.23.4-bullseye-perl

RUN apt-get update
RUN apt-get install -y certbot iputils-ping cron

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
RUN apt-get install -y python3-pip
RUN pip3 install python-crontab

RUN mkdir -p /etc/nginx/html/
RUN echo "certbot" > /etc/nginx/html/index.html

# RUN mkdir -p /opt/rp
COPY ./build/setup.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/*.sh

COPY ./build/setup-nginx-config.py /opt/rp/