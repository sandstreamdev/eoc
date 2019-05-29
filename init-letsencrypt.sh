#!/bin/bash

domains=(eoc.sanddev.com app.eoc.sanddev.com)
data_path="/data/certbot"
staging=1

if [ -e "$data_path/conf/live/${domains[0]}/privkey.pem" ] || [ -e "$data_path/conf/live/${domains[1]}/privkey.pem" ]; then
  echo "Certificates exists, skipping init";
  exit;
fi

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -o "$data_path/conf/options-ssl-nginx.conf" https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/options-ssl-nginx.conf
  curl -o "$data_path/conf/ssl-dhparams.pem" https://raw.githubusercontent.com/certbot/certbot/master/certbot/ssl-dhparams.pem
  echo
fi

for domain in "${domains[@]}"; do
  echo "### Creating dummy certificate for $domain ..."
  sudo mkdir -p "$data_path/conf/live/$domain"
  conatiner_path="/etc/letsencrypt/live/$domain"
  docker-compose run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:1024 -days 1\
      -keyout '$conatiner_path/privkey.pem' \
      -out '$conatiner_path/fullchain.pem' \
      -subj '/CN=localhost'" certbot
done

echo "### Starting nginx ..."
docker-compose up --force-recreate -d nginx-production
echo

for domain in "${domains[@]}"; do
  echo "### Deleting dummy certificate for $domain ..."
  docker-compose run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$domain && \
    rm -Rf /etc/letsencrypt/archive/$domain && \
    rm -Rf /etc/letsencrypt/renewal/$domain.conf" certbot
  echo
done

echo "### Requesting Let's Encrypt certificate for $domains ..."
#Join $domains to -d args
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    --email marek.rozmus@sandstream.pl --agree-tos --no-eff-email \
    $domain_args \
    --rsa-key-size 4096 \
    --force-renewal" certbot
echo

echo "### Reloading nginx ..."
docker-compose exec nginx-production nginx -s reload
