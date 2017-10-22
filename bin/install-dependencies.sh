#!/bin/bash
cd /tmp/

curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo bash -
sudo yum install -y nodejs npm > ./log

cd /var/www/platform
#sudo npm update > ./update.log
#sudo node_modules/.bin/sequelize db:migrate
sudo npm install pm2 -g