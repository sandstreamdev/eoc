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

  /**
   * TODO Refferer is not always present on req. FIXIT
   */
  const clientUrl = req.headers.referer;
  res.status(200);
  res.redirect(clientUrl);
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
