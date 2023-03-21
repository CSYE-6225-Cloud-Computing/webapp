#!/bin/bash

# General updates for Linux
# ---------------------------------------------------------------------
yum check-update
sudo yum update -y
sudo yum upgrade

# installing node js for our application
# ---------------------------------------------------------------------
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

# extracting(unzip) the provisioned webapp file
# deleting the zip file after unzip
# navigate to webapp using cd
# installing dependancies for webapp
# ---------------------------------------------------------------------
unzip webapp.zip -d webapp
rm webapp.zip
cd webapp || { echo "cd failed"; }
npm i --save

# create a service file for webapp
# move the service file to systemd folder
# remove already moved file at source
# ---------------------------------------------------------------------
cat >> webapp.service <<'EOF'
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

sudo cp -R "/home/ec2-user/webapp/webapp.service" "/etc/systemd/system/"
rm webapp.service


# installing cloud watch agent
# creating the cloud watch agent config file
# copying the cloud watch agent config to desired location
# deleteing the file at source because its moved to destination as per previous copy action
# ------------------------------------------------------------------------------------------------
sudo yum install amazon-cloudwatch-agent

cat >> amazon-cloudwatch-agent.json <<'EOF'
{
  "agent": {
      "metrics_collection_interval": 10,
      "logfile": "/var/logs/amazon-cloudwatch-agent.log"
  },
  "logs": {
      "logs_collected": {
          "files": {
              "collect_list": [
                  {
                      "file_path": "/var/log/node18/csye6225.log", #**********************************
                      "log_group_name": "csye6225",
                      "log_stream_name": "webapp"
                  }
              ]
          }
      },
      "log_stream_name": "cloudwatch_log_stream"
  },
  "metrics":{
    "metrics_collected":{
       "statsd":{
          "service_address":":8125",
          "metrics_collection_interval":15,
          "metrics_aggregation_interval":300
       }
    }
 }
}
EOF

sudo cp -R "/home/ec2-user/webapp/amazon-cloudwatch-agent.json" "/opt/aws/amazon-cloudwatch-agent/etc/" #***************************
rm amazon-cloudwatch-agent.json

