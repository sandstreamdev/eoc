const { FRONTEND_URL } = require('../common/variables');

const setUserAndSession = (req, res) => {
  req.session.token = req.user.token;

  // Set user cookies
  res.cookie(
    'user',
    JSON.stringify({
      name: req.user.displayName,
      id: req.user.id,
      avatar: req.user.photos[0].value
    })
  );

  res.redirect(FRONTEND_URL);
};

const logout = (req, res) => {
  req.session.destroy(() => {
    req.logout();

    res.clearCookie('connect.sid');
    res.clearCookie('user');
    res.redirect(FRONTEND_URL);
  });
};

module.exports = {
  setUserAndSession,
  logout
};
