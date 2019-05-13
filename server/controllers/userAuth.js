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
  res.redirect('/');
};

const logout = (req, res) => {
  req.session.destroy(() => {
    req.logout();

    res.clearCookie('connect.sid');
    res.clearCookie('user');
    res.redirect('/');
  });
};

module.exports = {
  logout,
  setUserAndSession
};
