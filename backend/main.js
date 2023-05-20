const http = require('http');
const Server = require('socket.io').Server;
const express = require('express');
const logger = require('morgan');
const connectDB = require('./src/db/dbController');
const path = require('path');
const cors = require('cors');

connectDB();

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
  },
});

app.set('io', io);
app.use(express.static(path.join(__dirname, 'public')));
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});
app.use(logger('dev'));
app.use(express.json({ extended: false }));
app.use('/api', require('./src/routes/api/apiRouter'));

var indexRouter = require('./src/routes/index');

app.use('/', indexRouter);
app.use('*', indexRouter);

io.on('connection', (socket) => {
  console.log('new user connection!');

  socket.on('join_room', (roomName, done) => {
    socket.join(roomName);
    console.log('new user join! room name: ' + roomName);

    socket.to(roomName).emit('welcome');
  });
  socket.on('offer', (offer, roomName) => {
    socket.to(roomName).emit('offer', offer);
  });
  socket.on('answer', (answer, roomName) => {
    socket.to(roomName).emit('answer', answer);
  });
  socket.on('ice', (ice, roomName) => {
    socket.to(roomName).emit('ice', ice);
  });
  socket.on('disconnect', () => {
    console.log('disconnect');
  });
});

httpServer.listen(3000);
