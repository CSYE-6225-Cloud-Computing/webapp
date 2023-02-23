#!/bin/bash

yum check-update
sudo yum update -y

sudo amazon-linux-extras install -y nginx1

sudo amazon-linux-extras enable postgresql14
sudo yum install postgresql postgresql-server -y

sudo postgresql-setup initdb

sudo systemctl enable postgresql
sudo systemctl start postgresql

sudo sed -i "/^host.*all.*all.*127.0.0.1\\/32.*ident/ s/ident/md5/" /var/lib/pgsql/data/pg_hba.conf
sudo sed -i "/^host.*all.*all.*::1\\/128.*ident/ s/ident/md5/" /var/lib/pgsql/data/pg_hba.conf

sudo systemctl restart postgresql

sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE users;"

sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

cd webapp
unzip webapp.zip
cd webapp
npm i --save

sudo cp -R "/home/ec2-user/webapp/webapp.service" "/home/../etc/systemd/system/"

cd /home/../etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl enable webapp.service
sudo systemctl start webapp.service

sudo systemctl status webapp.service

# sudo journalctl -u webapp.service
