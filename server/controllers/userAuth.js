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
  res.status(200);
  res.redirect(req.headers.referer);
};

const logout = (req, res) => {
  req.session.destroy(() => {
    req.logout();

    res.clearCookie('connect.sid');
    res.clearCookie('user');
  });
  res.status(200).end();
};

module.exports = {
  logout,
  setUserAndSession
};
