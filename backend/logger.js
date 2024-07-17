const pino = require('pino');

const logger = pino({
  name: 'express',
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:dd-mm-yyyy HH-MM-ss',
      // messageFormat: '{req.method} {req.url} {res.statusCode} - - {responseTime} ms',
      // hideObject: true
    },
  },
});

module.exports = logger;
