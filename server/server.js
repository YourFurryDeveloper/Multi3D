const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let users = {};

app.use(express.static('public'));

// Handle incoming WebSocket connections
io.on('connection', (socket) => {
  console.log('a user connected');
  
  // When a user joins, assign them a username and store them
  socket.on('join', (username) => {
    users[socket.id] = { username, position: { x: 0, y: 0, z: 0 } };
    console.log(`${username} joined`);
    io.emit('userList', users); // broadcast the user list
  });

  // Update user position
  socket.on('move', (position) => {
    if (users[socket.id]) {
      users[socket.id].position = position;
      io.emit('userMove', { id: socket.id, position });
    }
  });

  // When a user disconnects, remove them from the list
  socket.on('disconnect', () => {
    console.log(`${users[socket.id]?.username} disconnected`);
    delete users[socket.id];
    io.emit('userList', users); // broadcast the updated user list
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
