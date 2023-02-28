#!/bin/bash

yum check-update
sudo yum update -y
sudo yum upgrade

sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

unzip webapp.zip
cd webapp
npm i --save

touch ./webapp/app.env

cat >> /etc/systemd/system/webapp.service <<'EOF'
[Unit]
Description=webapp
After=multi-user.target

[Service]
ExecStart=/usr/bin/node /home/ec2-user/webapp/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=webapp
User=ec2-user
EnvironmentFile=/home/ec2-user/webapp/app.env

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload

sudo systemctl enable webapp.service
sudo systemctl start webapp.service

sudo systemctl status webapp.service