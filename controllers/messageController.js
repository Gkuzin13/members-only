const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

exports.create_message_get = function (req, res, next) {
  res.render('create-message', { user: req.user });
};

exports.create_message_post = [
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('message', 'Message must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('create-message');
      return;
    }

    try {
      const message = new Message({
        title: req.body.title,
        content: req.body.message,
        timestamp: Date.now(),
        message_owner: req.user._id,
      });

      await message.save();

      res.redirect('/');
    } catch (err) {
      return next(err);
    }
  },
];

// Get messages on index get
exports.get_messages = async function (req, res, next) {
  try {
    const messages = await Message.find({})
      .sort({ timestamp: -1 })
      .populate('message_owner', 'username');

    res.render('index', {
      messages: messages,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};
