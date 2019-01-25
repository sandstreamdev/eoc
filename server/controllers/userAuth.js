const { FRONTEND_URL } = require('../common/variables');

const setUserAndSession = (req, res) => {
  // Set user cookies
  res.cookie(
    'user',
    JSON.stringify({
      name: req.user.displayName,
      id: req.user.idFromProvider,
      avatar: req.user.avatar,
      token: 'token'
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
  logout,
  setUserAndSession
};
