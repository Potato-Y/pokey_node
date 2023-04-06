const http = require('http');
const Server = require('socket.io').Server;
const express = require('express');
const connectDB = require('./src/db/dbController');

connectDB();

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
  },
});

app.use(express.json({ extended: false }));
app.use('/api', require('./src/routes/api/apiRouter'));

io.on('connection', (socket) => {
  console.log('new user connection!');
});

httpServer.listen(3000);
