const http = require('http');
const Server = require('socket.io').Server;
const express = require('express');
const logger = require('morgan');
const connectDB = require('./src/db/dbController');
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
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});
app.use(logger('dev'));
app.use(express.json({ extended: false }));
app.use('/api', require('./src/routes/api/apiRouter'));

io.on('connection', (socket) => {
  console.log('new user connection!');
});

httpServer.listen(3000);
