#!/usr/bin/env bash
cd /var/www/platform
npm killall -INT node > stop.log || true