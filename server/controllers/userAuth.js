const sendUser = (req, resp) => {
  const { avatarUrl, _id: id, displayName: name } = req.user;
  resp.cookie('user', JSON.stringify({ avatarUrl, id, name }));
  resp.redirect('/');
};

const logout = (req, resp) => {
  req.session.destroy(() => {
    req.logout();

    resp.clearCookie('connect.sid');
    resp.clearCookie('user');
    resp.clearCookie('demo');
    resp.redirect('/');
  });
};

const sendDemoUser = (req, resp) => {
  const { avatarUrl, _id: id, displayName: name } = req.user;
  resp.cookie('user', JSON.stringify({ avatarUrl, id, name }));
  resp.cookie('demo', true);
  resp.redirect('/');
};

module.exports = {
  logout,
  sendDemoUser,
  sendUser
};
