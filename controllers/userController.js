const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const async = require('async');
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

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('sign-up-form', {});
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });

      const saveUser = await user.save();

      res.redirect('/log-in');
    } catch {
      res.redirect('/sign-up');
    }
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
