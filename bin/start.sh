#!/usr/bin/env bash
cd /var/www/platform
pm2 start bin/www
sudo service nginx start