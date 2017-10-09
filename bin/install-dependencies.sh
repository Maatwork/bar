#!/bin/bash
cd /tmp/

curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo bash -
sudo yum install -y nodejs npm > ./log

cd /var/www/platform
npm update