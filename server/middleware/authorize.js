const authorize = (req, res, next) => {
  if (!req.user) {
    return res.status(403).send({
      error: true,
      message: 'Unauthorized access.'
    });
  }
  return next();
};

module.exports = { authorize };
