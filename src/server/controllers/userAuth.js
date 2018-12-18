const setUserAndSession = (req, res) => {
  req.session.token = req.user.token;

  // Set user cookies
  res.cookie('user_name', req.user.displayName);
  res.cookie('user_id', req.user.id);

  res.redirect('http://localhost:3000/');
};

const logout = (req, res) => {
  req.session.destroy(() => {
    req.logout();

    res.clearCookie('connect.sid');
    res.clearCookie('user_name');
    res.clearCookie('user_id');
    res.redirect('http://localhost:3000/');
  });
};

module.exports = {
  setUserAndSession,
  logout
};
