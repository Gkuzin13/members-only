const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { user: req.user });
});

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

module.exports = router;
