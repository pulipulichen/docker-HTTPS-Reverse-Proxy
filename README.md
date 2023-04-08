# docker-HTTPS-Reverse-Proxy
Nginx Reverse Proxy with HTTPS via LetsEncrypt and update certification regularly.

## How to Use

1. `git clone`
2. Set up configuration in `docker-compose.yml` .
3. `startup.sh` .

## Configuration

- ./docker-compose.yml
- ./config/nginx/nginx-http.conf
- ./config/nginx/nginx-https.conf


rp-test-20230408-1217-a.pulipuli.info,http://

RP_BACKEND=rp-test-20230408-1217-a.pulipuli.info,http://example.com|rp-test-20230408-1217-c.pulipuli.info,http://www.helloworld.org