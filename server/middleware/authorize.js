const authorize = (req, res, next) => {
  if (!req.user) {
    if (req.cookies['connect.sid']) {
      res.clearCookie('connect.sid');
      res.clearCookie('user');
      return res.status(403).send({
        error: true,
        message:
          'Your session has ended, you will be redirect to the login page for 5s.'
      });
    }
    return res.status(403).send({
      error: true,
      message: 'Unauthorized access.'
    });
  }
  return next();
};

module.exports = { authorize };
