#!/usr/bin/env bash
cd /var/www/platform
sudo service nginx stop || true
pm2 stop www || true