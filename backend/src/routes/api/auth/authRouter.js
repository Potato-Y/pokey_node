const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../../models/User');

router.post('/registre', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // email을 통해 중복 확인
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        errors: [
          {
            errors: [
              {
                message: 'User already exists',
              },
            ],
          },
        ],
      });
    }

    user = new User({
      name,
      email,
      password,
    });

    // password 암호화
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.send('Success');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // DB에 이메일 요청
  let user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({
      errors: [
        {
          message: 'Not found user',
        },
      ],
    });
  }

  bcrypt.compare(password, user.password, async (err, isMatch) => {
    if (err) {
      return res.status(400).json({
        errors: [
          {
            message: 'Server Error.',
          },
        ],
      });
    }

    // 비밀번호가 같지 않음
    if (!isMatch) {
      return res.status(400).json({
        errors: [
          {
            message: 'Not password',
          },
        ],
      });
    }

    // 비밀번호가 같을 경우 Token 생성
    const token = jwt.sign(user._id.toHexString(), 'createToken');

    user.token = token;
    await user.save();
    res.json({
      success: true,
      token: token,
      userId: user._id,
    });
  });
});

router.post('/token_state', (req, res) => {
  const { token } = req.body;
  User.findByToken(token, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(400).json({
        errors: [
          {
            message: 'Token expiration',
          },
        ],
      });
    }

    res.status(200).json({
      email: user.email,
      name: user.name,
      isAuth: true,
    });
  });
});

router.post('/logout', (req, res) => {
  const { token } = req.body;
  User.findByToken(token, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(400).json({
        errors: [
          {
            message: 'Token expiration',
          },
        ],
      });
    }

    try {
      await User.findByIdAndUpdate({ _id: user._id }, { token: '' });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        success: false,
      });
    }

    if (user.token != '') {
      console.error(err);
      return res.status(400).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
    });
  });
});

module.exports = router;
