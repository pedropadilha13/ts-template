import winston from 'winston';

/*
  Create Logger and add 2 File Transports, for levels 'error' (error.log) and 'info' (combined.log) 
*/
const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'combined.log',
      level: process.env.LOG_LEVEL || 'info'
    })
  ]
});

/*
  If NODE_ENV is not production, we add a Console Transport with a level of 'debug' to our Logger
*/
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      level: 'debug'
    })
  );
}

export { logger };
