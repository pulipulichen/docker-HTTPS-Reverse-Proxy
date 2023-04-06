FROM ngnix:1.23.4-bullseye-perl

RUN apt-get update
RUN apt-get install -y certbot
