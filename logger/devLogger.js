const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  });

const devLogger = () =>{

    return createLogger({
        level: 'debug',
        format: combine(
            format.colorize(),
            timestamp({format: "HH:mm:ss"}),
            myFormat
          ),
        transports: [
          new transports.File({ filename: './logs/error.log', level: 'error' }),
          new transports.File({ filename: './logs/combined.log' }),
        ],
      });

}

module.exports = devLogger;

