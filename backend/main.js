const Http = require('http');
const Server = require('socket.io').Server;
const Express = require('express');

const app = Express();

const httpServer = Http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
  },
});

io.on('connection', (socket) => {
  console.log('new user connection!');
});

httpServer.listen(3000);
