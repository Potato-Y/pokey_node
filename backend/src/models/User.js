const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Schema 생성
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokenExp: {
    type: Number,
  },
});

UserSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

UserSchema.methods.generateToken = function (callback) {
  var user = this;

  const token = jwt.sign({'id':user._id.toHexString(),'name':user.name}, 'createToken');

  user.token = token;
  user.save();
  callback(null, user);
};

UserSchema.statics.findByToken = function (token, callback) {
  var user = this;

  // token을 decode 한다.
  jwt.verify(token, 'createToken', async function (err, decoded) {
    // 유저 아이디를 이용해 유저를 찾은 다음
    // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
    try {
      user = await user.findOne({ _id: decoded.id});
      callback(err, user);
    } catch (err) {
      return callback(err);
    }
  });
};

const User = mongoose.model('user', UserSchema);

module.exports = { User };
