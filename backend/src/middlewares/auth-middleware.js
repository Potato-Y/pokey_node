const { User } = require('../models/User');

const authMiddleware = (req, res, next) => {
  // get 방식, post 방식에 따라 token 불러오기
  var { token } = req.query;
  if (token === undefined) {
    token = req.body.token;
  }

  // 토큰을 복호화 한 뒤에, 일치하는 유저 찾기
  User.findByToken(token, (err, user) => {
    if (err) {
      console.error(err.message);
    }
    if (!user) {
      return res.status(400).json({
        errors: [
          {
            message: 'Not Found.',
          },
        ],
      });
    }

    req.user = user;
    next();
  });
};

const socketAuthMiddleware = (token) => {
  return new Promise((resolve, reject) => {
    // 토큰을 복호화 한 뒤에, 일치하는 유저 찾기
    User.findByToken(token, (err, user) => {
      if (err) {
        console.error(err.message);
      }
      if (!user) {
        console.log('비정상 경로로 유저가 접속하였습니다.');
        resolve(false);
      }

      resolve(user);
    });
  });
};

module.exports = { authMiddleware, socketAuthMiddleware };
