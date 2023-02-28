#!/bin/bash

yum check-update
sudo yum update -y
sudo yum upgrade

sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

pwd

unzip webapp.zip

pwd

ls

cd webapp

pwd

ls

npm i --save

ls

touch app.env

pwd

ls

cat >> webapp.service <<'EOF'
[Unit]
Description=webapp
After=multi-user.target

[Service]
ExecStart=/usr/bin/node /home/ec2-user/webapp-main/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=webapp
User=ec2-user
EnvironmentFile=/home/ec2-user/app.env

[Install]
WantedBy=multi-user.target
EOF

pwd

ls

sudo cp -R "/home/ec2-user/webapp.service" "/etc/systemd/system/"
