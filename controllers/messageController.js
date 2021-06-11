const Message = require('../models/message');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const async = require('async');

exports.create_message_get = function (req, res, next) {
  res.render('create-message', { user: req.user });
};

exports.create_message_post = [
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('message', 'Message must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('create-message');
      return;
    }

    const message = new Message({
      title: req.body.title,
      content: req.body.message,
      timestamp: Date.now(),
      message_owner: req.user._id,
    }).save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect('/');
    });
  },
];

// Get messages on index get
exports.get_messages = function (req, res, next) {
  async.parallel(
    {
      messages: function (callback) {
        Message.find(callback);
      },
      users: function (callback) {
        User.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      res.render('index', {
        messages: results.messages,
        users_list: results.users,
        user: req.user,
      });
    }
  );
};
