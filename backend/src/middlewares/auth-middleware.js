const { User } = require('../models/User');

const authMiddleware = (req, res, next) => {
  const { token } = req.query;

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

module.exports = { authMiddleware };
