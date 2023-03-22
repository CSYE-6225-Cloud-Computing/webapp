var StatsD = require('node-statsd');

var client = new StatsD({
  host: `${Process.env.EC2_IP_ADDRESS}`, 
  port: 8125, 
  prefix: 'webapp.' 
});

module.exports = client;
