#!/bin/bash
cd /tmp/

sudo curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
sudo yum install -y nodejs npm > ./log

sudo npm update