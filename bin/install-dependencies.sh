#!/bin/bash
cd /tmp/

curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo bash -
yum install -y nodejs npm > ./log

npm update