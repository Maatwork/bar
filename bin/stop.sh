#!/usr/bin/env bash
cd /var/www/platform
pm2 unstartup
sudo service nginx stop
pm2 stop