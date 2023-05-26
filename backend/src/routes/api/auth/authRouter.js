const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { authMiddleware } = require('../../../middlewares/auth-middleware');

const { User } = require('../../../models/User');

router.post('/register', async (req, res) => {
  const { name, email, password, country, language } = req.body;

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
      country,
      language,
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

  user.comparePassword(password, (err, isMatch) => {
    if (!isMatch) {
      console.log(err);
      return res.status(400).json({
        errors: [
          {
            message: 'Server Error.',
          },
        ],
      });
    }

    user.generateToken((err, user) => {
      if (err) {
        return res.status(400).json({
          errors: [
            {
              message: 'Not password',
            },
          ],
        });
      }
      return res.json({
        success: true,
        token: user.token,
        name: user.name,
        country: user.country,
        language: user.language,
      });
    });
  });
});

router.get('/token_state', authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    email: user.email,
    name: user.name,
    country: user.country,
    language: user.language,
    isAuth: true,
  });
});

router.post('/token_state', authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    email: user.email,
    name: user.name,
    country: user.country,
    language: user.language,
    isAuth: true,
  });
});

/**
 * 회원 정보 수정.
 * 회원 정보는 국가와 사용 언어를 변경할 수 있다.
 */
router.post('/changing_information', authMiddleware, (req, res) => {
  const user = req.user;
  const changeInfo = req.body.info;

  User.findOne({ _id: user._id.toString() })
    .then((userDoc) => {
      userDoc.name = changeInfo.name;
      userDoc.country = changeInfo.country;
      userDoc.language = changeInfo.language;
      return userDoc.save();
    })
    .then((result) => {
      // console.log('@@result : ', result);
      return res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      console.log('@@err : ', err);
      return res.status(400).json({
        success: false,
      });
    });
});

/**
 * 회원 정보 수정.
 * Password를 변경할 수 있다.
 */
router.post('/changing_password', authMiddleware, async (req, res) => {
  const user = req.user;
  const changeInfo = req.body.info;

  // password 암호화
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(changeInfo.password, salt);

  User.findOne({ _id: user._id.toString() })
    .then((userDoc) => {
      userDoc.password = password;
      return userDoc.save();
    })
    .then((result) => {
      // console.log('@@result : ', result);
      return res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      console.log('@@err : ', err);
      return res.status(400).json({
        success: false,
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
