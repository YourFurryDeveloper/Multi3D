// /api/game.js
import { Server } from 'socket.io';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).send('Socket.io Server is running');
  }

  const io = new Server(res.socket.server);

  io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('join', (username) => {
      console.log(`${username} joined`);
      // Add user to the game
    });

    socket.on('move', (position) => {
      // Handle player movement
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  res.socket.server.io = io;
  res.end();
}
