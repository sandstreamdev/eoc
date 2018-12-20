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

  res.redirect('http://localhost:3000/');
};

const logout = (req, res) => {
  req.session.destroy(() => {
    req.logout();

    res.clearCookie('connect.sid');
    res.clearCookie('user');
    res.redirect('http://localhost:3000/');
  });
};

module.exports = {
  setUserAndSession,
  logout
};
