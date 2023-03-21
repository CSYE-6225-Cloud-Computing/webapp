var StatsD = require('statsd');

var client = new StatsD({
  host: 'localhost', 
  port: 8125, 
  prefix: 'webapp.' 
});

module.exports = client;
