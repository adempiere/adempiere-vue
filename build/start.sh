#!/bin/sh

# folder with dist app files
cd /var/www/adempiere-vue/dist/

# Set API Proxy connection
find -name 'app.*.js' -exec sed -i "s|https://api.erpya.com|$API_URL|g" {} \;

# Run app
yarn start && tail -f /dev/nul
