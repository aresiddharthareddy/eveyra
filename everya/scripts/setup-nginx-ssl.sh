#!/bin/bash
set -e

PUBLIC_IP="${PUBLIC_IP:-98.93.146.99}"
SSL_DIR="/etc/nginx/ssl/everya"

sudo mkdir -p "$SSL_DIR"

if [ ! -f "$SSL_DIR/everya.crt" ]; then
  sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SSL_DIR/everya.key" \
    -out "$SSL_DIR/everya.crt" \
    -subj "/CN=${PUBLIC_IP}" \
    -addext "subjectAltName=IP:${PUBLIC_IP},DNS:localhost"
  echo "Created self-signed certificate for ${PUBLIC_IP}"
fi

sudo tee /etc/nginx/sites-available/everya > /dev/null <<EOF
# Redirect HTTP -> HTTPS
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name ${PUBLIC_IP} _;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name ${PUBLIC_IP} _;

    ssl_certificate ${SSL_DIR}/everya.crt;
    ssl_certificate_key ${SSL_DIR}/everya.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/everya /etc/nginx/sites-enabled/everya
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
echo "Nginx HTTPS proxy ready at https://${PUBLIC_IP}"
