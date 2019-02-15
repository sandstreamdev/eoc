const authorize = (req, res, next) => {
  if (!req.user) {
    const error = {
      error: true,
      message: 'Unauthorized access.'
    };

    if (req.cookies['connect.sid']) {
      res.clearCookie('connect.sid');
      res.clearCookie('user');
      error.message =
        'Your session has ended, you will be redirect to the login page for 5s.';
    }
    res.status(403).send(error);
  }
  return next();
};

module.exports = { authorize };
