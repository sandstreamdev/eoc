const setUserAndSession = (req, res) => {
  // Set user cookies
  res.cookie(
    'user',
    JSON.stringify({
      avatarUrl: req.user.avatarUrl,
      id: req.user.id,
      name: req.user.displayName
    })
  );
  if (req.user.idFromProvider === process.env.DEMO_USER_ID_FROM_PROVIDER) {
    res.cookie('demo', true);
  }
  res.redirect('/');
};

const logout = (req, res) => {
  req.session.destroy(() => {
    req.logout();

    res.clearCookie('connect.sid');
    res.clearCookie('user');
    res.clearCookie('demo');
    res.redirect('/');
  });
};

module.exports = {
  logout,
  setUserAndSession
};
