const io = require('socket.io-client');

// Connect to game namespace
const gameSocket = io('http://localhost:5000/game', { autoConnect: false });

// Connect to chat namespace
const chatSocket = io('http://localhost:5000/chat', { autoConnect: false });

const duelId = '668cef5d150a88c2873b80c9';
const username = "shy"; // Make sure to set the username here
const sessionID = duelId; // Make sure to set the sessionID here
const userId = '6689a65c6fc50c705082698d'; // Make sure to set the userId here

if (username && sessionID) {
  gameSocket.auth = { username, sessionID };
  chatSocket.auth = { username, sessionID };

  // Listen for game connection event
  gameSocket.on('connect', () => {
       console.log('Connected to game server with ID:', gameSocket.id);
    gameSocket.emit('createRoom', duelId, username, userId);
  });

  // Listen for chat connection event
  chatSocket.on('connect', () => {
    console.log('Connected to chat server with ID:', chatSocket.id);
    // Additional logic for chat connection
  });

  // Listen for game current users
  gameSocket.on('currentUsers', (users) => {
    console.log('Current connected users in game:', users);
  });
  // listen for game notification
   gameSocket.on('notification', (notification) => {
    console.log('new notification: ', notification);
  });
  // Listen for game start event
  gameSocket.on('gameStart', (data) => {
  const { message, gameState } = data;
  console.log('New message:', message);
  console.log('Game state:', gameState);
});

  // Listen for chat current users
  chatSocket.on('currentUsers', (users) => {
    console.log('Current connected users in chat:', users);
  });

  // Add listeners for other events in both namespaces as needed

  // Manually connect the sockets
  gameSocket.connect();
  // chatSocket.connect();
} else {
  console.log("Username must be set before connecting.");
}
