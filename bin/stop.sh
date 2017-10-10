#!/usr/bin/env bash
cd /var/www/platform
sudo service nginx stop
pm2 stop www || true