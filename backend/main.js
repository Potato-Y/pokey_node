const http = require('http');
const Server = require('socket.io').Server;
const express = require('express');
const logger = require('morgan');
const connectDB = require('./src/db/dbController');
const path = require('path');
const cors = require('cors');
const { socketAuthMiddleware } = require('./src/middlewares/auth-middleware');
// const { Translate } = require('@google-cloud/translate').v2; //api 사용을 위해 모듈 가져오기

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

// const translate = new Translate({
//   keyFilename: path.join(__dirname, './google_cloud_key.json'), // 인증 정보 파일의 경로를 옵션으로 설정합니다.
// });

const translateText = async (text, targetLanguage) => {
  //translate.translate사용하여 메시지 변역 결과 반환
  const [translation] = await translate.translate(String(text), targetLanguage);
  return translation;
};

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

    // 기존에는 방에 입장 할 경우 전체에게 누군가 들어왔단 것을 알렸음.
    // 앞으로는 방에 입장을 한 뒤에, 방 유저들에게 웰컴 안내를 할 예정.
    // socket.to(roomName).emit('welcome');

    socket.join(roomName);

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
        console.log(`new user join! user: ${socket.user.name} room name: ${roomName}`);
        // socket.to(roomName).emit('welcome', { socketId: socket.id, name: socket.user.name });
        io.sockets.adapter.rooms.get(roomName).forEach((item) => {
          if (item) {
            console.log('send ' + item);
            socket.to(item).emit('welcome', { socketId: socket.id, name: socket.user.name });
          }
        });
        done();
      } else if (io.sockets.adapter.rooms.get(roomName).roomAdmin == user.email) {
        // 방장인 경우 재입장이 가능하도록 추가
        socket.join(roomName);
        console.log(`new user join! user: ${socket.user.name} room name: ${roomName}`);
        // socket.to(roomName).emit('welcome', { socketId: socket.id, name: socket.user.name });
        io.sockets.adapter.rooms.get(roomName).forEach((item) => {
          if (item) {
            socket.to(item).emit('welcome', { socketId: socket.id, name: socket.user.name });
          }
        });
        done();
      } else {
        socket.emit('not_room_auth');
        socket.disconnect();
        return console.log('disconnect');
      }
    }
  });

  socket.on('offer', (targetId, offer) => {
    socket.to(targetId).emit('offer', { socketId: socket.id, name: socket.user.name }, offer);
  });
  socket.on('answer', (targetId, answer) => {
    socket.to(targetId).emit('answer', { socketId: socket.id, name: socket.user.name }, answer);
  });
  socket.on('ice', (targetId, ice) => {
    socket.to(targetId).emit('ice', { socketId: socket.id, name: socket.user.name }, ice);
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

  socket.on('trans', (roomName, text) => {
    /**
     * 번역한 데이터들을
     */
    var data = [];
    const date = new Date();
    console.log(date + socket.id + '가 번역을 요청 함: ' + text);

    io.sockets.adapter.rooms.get(roomName).forEach(async (socketId) => {
      if (socketId) {
        // 본인인 경우 종료
        if (socket.id == socketId) {
          // console.log('[' + socketId + '] 전송을 함. 자신이 말한 내용 : ' + text);
          // return socket.to(socketId).emit('trans_me', date, text);
          return;
        }

        let socketInfo = io.sockets.sockets.get(socketId);
        if (socketInfo) {
          // socket 정보가 있을 경우 실행
          /**
           * 유저 개인 정보
           */
          let user = socketInfo.user;
          let language = user.language;

          // 만약 이미 해당 언어에 대한 번역한 내용이 있는 경우 바로 전송
          let searchTranslationData = data
            .filter(function (obj) {
              return obj.language === user.language;
            })
            .map(function (obj) {
              if (obj) {
                return obj.translation;
              }
            });

          // 만약 데이터가 있으면 이미 번역한 내용을 전송
          if (searchTranslationData[0]) {
            console.log('[' + socketId + '] 전송을 함. 미리 번역됨:' + searchTranslationData[0]);

            return socket.to(socketId).emit('trans_return', { socketId: socket.id, name: socket.user.name }, date, searchTranslationData[0]); // 번역 끄고 테스트 하는 용
          }

          if (!searchTranslationData[0]) {
            // const translation = await translateText(text, language); // 번역할 언어 설정
            // 원본 유저의 정보, 번역된 정보를 전송
            // data.push({ language: language, translation: translation });
            data.push({ language: language, translation: text }); // 테스트용
          }

          // 만약 data에 있는 내용이면 그걸 보내주는 코드가 필요함.

          // console.log(socketId + ' 전송을 함. 번역 내용:' + translation);
          console.log(socketId + ' 전송을 함. 번역 내용:' + text); // 번역 끄고 테스트 하는 용

          // 번역 요청 한 사람의 정보, 번역 내용
          // socket.to(socketId).emit('trans_return', { socketId: socket.id, name: socket.user.name },date, translation);
          socket.to(socketId).emit('trans_return', { socketId: socket.id, name: socket.user.name }, date, text); // 번역 끄고 테스트 하는 용
        }
      }
    });
  });

  socket.on('disconnect', () => {
    try {
      console.log(`user '${socket.user.name}' disconnect`);
    } catch {
      console.log(`not found user disconnect`);
    }
  });

  // 채팅 메시지
  socket.on('new_message', (msg, roomName, done) => {
    // socket.to(roomName).emit("new_message", { socketId: socket.id, name: socket.user.name },msg);
    io.sockets.adapter.rooms.get(roomName).forEach(async (socketId) => {
      if (socketId) {
        // socketid가 존재할 때
        if (socket.id == socketId) {
          // 차례대로 들어오면 이상없음
          return;
        }
        socket.to(socketId).emit('new_message', { socketId: socket.id, name: socket.user.name }, msg);
      }
    });

    console.log(`${socket.user.name} : ${msg}`);

    done();
  });
});

httpServer.listen(3000);
