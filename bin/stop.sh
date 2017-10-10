#!/usr/bin/env bash
cd /var/www/platform
(pm2 unstartup) || true
sudo service nginx stop
(pm2 stop) || true