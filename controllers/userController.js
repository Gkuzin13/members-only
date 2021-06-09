const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.create_user_get = function (req, res, next) {
  res.render('sign-up-form', {});
};

exports.create_user_post = [
  body('username', 'Username must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('password', 'Password must not be empty.')
    .trim()
    .isLength({ min: 8 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('sign-up-form', {});
      return;
    }

    User.findOne({ username: req.body.username }, async (err, user) => {
      if (err) {
        return res.render('sign-up-form', { message: err.message });
      }
      if (user) {
        return res.render('sign-up-form', {
          message: 'A user with that name already exists.',
        });
      }

      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = await new User({
          username: req.body.username,
          password: hashedPassword,
        }).save();

        req.login(newUser, (err) => {
          if (err) {
            return next(err);
          }

          return res.redirect('/');
        });
      } catch {
        res.redirect('/sign-up');
      }
    });
  },
];

exports.log_in_get = function (req, res, next) {
  res.render('log-in-form', {});
};

exports.log_in_post = [
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureFlash: true,
  }),
];
