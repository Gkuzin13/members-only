exports.checkAuthenticate = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/log-in');
};

exports.checkNotAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  next();
};
