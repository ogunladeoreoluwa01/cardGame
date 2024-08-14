const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const expressPino = require('pino-http');
const logger = require('./logger');
const cors = require('cors');
const http = require('http');
const { initializeSocket, getSocketInstance } = require('./utils/socketio');

// route imports
const authRoute = require('./routes/auth.routes');
const demoRoute = require('./routes/demo.routes');
const userRoute = require('./routes/user.routes')

const app = express();
const Port = process.env.PORT || 3000;
const expressLogger = expressPino({ logger });

// Middleware
app.use(cors());
app.use(express.json());
app.use(expressLogger);
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user',userRoute)
app.use('/api/demo', demoRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
initializeSocket(server);

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    logger.info('Database connected');

    server.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('Closed out remaining connections.');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  })
  .catch((error) => {
    logger.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1); // Terminate the application if unable to connect to the database
  });
