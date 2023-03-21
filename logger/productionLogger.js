const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  });

const productionLogger = () =>{

    return createLogger({
        level: 'info',
        format: combine(
          timestamp({ format: "HH:mm:ss" }),
          myFormat
        ),
        transports: [
         new transports.File({ filename: 'home/ec2-user/webapp/logs/csye6225.log' }),
        ],
      });

}

module.exports = productionLogger;

