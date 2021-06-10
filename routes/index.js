const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

/* GET home page. */
router.get('/', messageController.get_messages);

// Get sign up page
router.get(
  '/sign-up',
  auth.checkNotAuthenticated,
  userController.create_user_get
);

// Handle user create on POST
router.post(
  '/sign-up',
  auth.checkNotAuthenticated,
  userController.create_user_post
);

// Get log in page
router.get('/log-in', auth.checkNotAuthenticated, userController.log_in_get);

// Handle user log in on POST
router.post('/log-in', auth.checkNotAuthenticated, userController.log_in_post);

// Handle user log out
router.delete('/log-out', (req, res) => {
  req.logOut();
  res.redirect('/');
});

// Render create message page on GET
router.get(
  '/create-message',
  auth.checkAuthenticate,
  messageController.create_message_get
);

// Handle create message on POST
router.post(
  '/create-message',
  auth.checkAuthenticate,
  messageController.create_message_post
);
module.exports = router;
