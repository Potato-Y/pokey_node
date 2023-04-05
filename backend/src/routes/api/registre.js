const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
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

module.exports = router;
