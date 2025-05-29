const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key'; 



router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { successRedirect: 'https://taskflowapplication1.netlify.app/dashboard', failureRedirect: '/login/failed' })
);


router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { successRedirect: 'https://taskflowapplication1.netlify.app/dashboard', failureRedirect: '/login/failed' })
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { successRedirect: 'https://taskflowapplication1.netlify.app/dashboard', failureRedirect: '/login/failed' })
);


router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, displayName });

    req.login(user, err => {
      if (err) return res.status(500).json({ message: 'Login failed after register' });
      res.status(201).json(user);
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});


router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Invalid credentials', user: null });
    }

   
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  })(req, res, next);
});


router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;