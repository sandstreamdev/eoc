domains=(eoc.sanddev.com app.eoc.sanndev.com)
data_path="/data/certbot"

if [ -e "$data_path/conf/live/${domains[0]}/privkey.pem" ] || if [ -e "$data_path/conf/live/${domains[1]}/privkey.pem" ]; then
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

echo "### Creating dummy certificate for $domains ..."
for domain in "${domains[@]}"; do
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

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --staging \
    --email marek.rozmus@sandstream.pl --agree-tos --no-eff-email \
    -d ${domains[0]} -d ${domains[1]} \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot
echo

command: certonly --webroot -w /var/www/certbot  --staging --rsa-key-size 4096 -d eoc.sanddev.com

echo "### Reloading nginx ..."
docker-compose exec nginx-production nginx -s reload
