const { Server } = require('socket.io');
const logger = require('../logger');
const sessionStore = require('../sessionStore');
const MAX_PING = 1000;


const {
  userAction_Defend,
  userAction_Attack,
  userAction_LeaveActiveDuel,
  GameLogic_HandlePlayerDisconnect,
  GameLogic_HandlePlayerReconnect,
} = require('./gameActions');

let io;
const users = {};

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const gameNamespace = io.of('/game');
  gameNamespace.use(handleSocketAuthentication);

  gameNamespace.on('connection', (socket) => {
    logger.info(`User connected to game: ${socket.id}`);

    if (socket.sessionID) {
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username
      });
    } else {
      const sessionID = socket.id;
      socket.sessionID = sessionID;
      sessionStore.saveSession(sessionID, {
        userID: socket.userID,
        username: socket.username
      });
    }

    socket.on('createRoom', (duelId, username, userId) => {
      socket.sessionID = duelId;
      socket.userID = userId;
      socket.username = username;
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username
      });

      try {
        socket.join(duelId);
        socket.to(duelId).emit('user joined', {
          socketID: socket.id,
          userID: socket.userID,
          username: socket.username
        });

        console.log(`User joined room ${duelId}: ${socket.id}, username: ${username}, userId: ${userId}`);
      } catch (e) {
        console.log('[error]', 'join room:', e);
        socket.emit('error', 'couldn’t perform requested action');
      }
    });

    socket.on('attackAction', async (data) => {
      await userAction_Attack(io,socket, data);
    });

    socket.on('defendAction', async (data) => {
      await userAction_Defend(io,socket, data);
    });

    socket.on('leaveDuel', async (data) => {
      await userAction_LeaveActiveDuel(io,socket, data);
    });

    socket.on('pong', (latency) => {
      if (latency > MAX_PING) {
        socket.emit('message', 'Your ping is too high. You will be kicked.');
        socket.disconnect();
      }
    });

    socket.on('ping', () => {
      socket.emit('pong');
    });

    socket.on('disconnect', async () => {
      try {
        const sessionId = socket.sessionID;
        const userId = socket.userID;

        await GameLogic_HandlePlayerDisconnect(io,socket, { sessionId, userId });

        logger.info(`User disconnected from game: ${socket.id}`);
      } catch (error) {
        logger.error("Error handling player disconnect:", error);
        socket.emit('notificationError', {
          forUser: socket.userID,
          message: "An error occurred while handling the player disconnect.",
        });
      }
    });

    socket.on('emote',(data) =>{
      const{emoji, userId, sessionID}= data
      console.log(emoji)
        io.of("game").to(sessionID).emit('emoteResult', {emoji});
    } )

    socket.on('reconnectToGame', async (data) => {
      await GameLogic_HandlePlayerReconnect(io,socket, data);
    });
  });

  const chatNamespace = io.of('/chat');
  chatNamespace.use(handleSocketAuthentication);

  chatNamespace.on('connection', (socket) => {
    logger.info(`User connected to chat: ${socket.id}`);

    socket.on('chatMessage', (message) => {
      socket.broadcast.emit('chatMessage', {
        userID: socket.userID,
        username: socket.username,
        message: message
      });
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected from chat: ${socket.id}`);
    });
  });

  function handleSocketAuthentication(socket, next) {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      const session = sessionStore.findSession(sessionID);
      if (session) {
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        return next();
      }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
  }
}

function getSocketInstance() {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initializeSocket first.");
  }
  return io;
}

module.exports = { initializeSocket, getSocketInstance };
