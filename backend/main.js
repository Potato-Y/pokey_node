const http = require('http');
const Server = require('socket.io').Server;
const express = require('express');
const logger = require('morgan');
const connectDB = require('./src/db/dbController');
const path = require('path');
const cors = require('cors');
const { socketAuthMiddleware } = require('./src/middlewares/auth-middleware');

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

  socket.on('join_room', async (roomName, token, done) => {
    // 토큰을 통해 해당 유저의 정보를 socket 안에 넣어준다.
    const user = await socketAuthMiddleware(token);

    if (user === false) {
      // 로그인을 하도록 not_auth 이벤트 전송
      socket.emit('not_auth');
      socket.disconnect();
      return console.log('disconnect');
    }

    // 소켓에 접속자의 정보를 저장한다.
    socket.user = user;

    // socket에서 유저 이름 가져오기
    // console.log(socket.user.name);

    socket.join(roomName);
    console.log(`new user join! user: ${socket.user.name} room name: ${roomName}`);

    socket.to(roomName).emit('welcome');

    // 새로 만든 방이면 방장 정보를 등록
    if (!io.sockets.adapter.rooms.get(roomName).roomAdmin) {
      console.log(`${roomName}은 새로 만들어진 방입니다.`);
      io.sockets.adapter.rooms.get(roomName).roomAdmin = user.email;

      // 필수 내용도 등록 (접속 가능한 유저 )
      // 방장이 접속 가능한 유저를 등록하기 이전에 오류가 발생하지 않도록 미리 선언한다.
      io.sockets.adapter.rooms.get(roomName).authUser = [];
      done();
    } else {
      // 입장 가능한 사람인지 확인 후 아닌 경우 돌려보내기
      if (io.sockets.adapter.rooms.get(roomName).authUser.includes(user.email)) {
        done();
      } else {
        socket.emit('not_room_auth');
        socket.disconnect();
        return console.log('disconnect');
      }
    }

    console.log(io.sockets.adapter.rooms);
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

  // 방에 접속 가능한 유저를 등록한다. 해당 기능은 방장만 사용 가능하다.
  socket.on('setAuthUser', (userEmail, roomName, done) => {
    try {
      // 요청자의 정보와 방장의 정보가 동일할 경우에 진행
      if (socket.user.email === io.sockets.adapter.rooms.get(roomName).roomAdmin) {
        io.sockets.adapter.rooms.get(roomName).authUser = [userEmail];
        done(true);
      } else {
        done(false);
      }
    } catch {
      done(false);
    }
  });
  socket.on('disconnect', () => {
    try {
      console.log(`user '${socket.user.name}' disconnect`);
    } catch {
      console.log(`not found user disconnect`);
    }
  });
});

httpServer.listen(3000);
