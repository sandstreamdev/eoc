const sanitize = require('mongo-sanitize');
const validator = require('validator');
const _some = require('lodash/some');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const BadRequestException = require('../common/exceptions/BadRequestException');
const User = require('../models/user.model');

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

const signUp = (req, resp, next) => {
  const { email, password, passwordConfirm, username } = req.body;
  const sanitizedEmail = sanitize(email);
  const sanitizedPassword = sanitize(password);
  const sanitizedPasswordConfirm = sanitize(passwordConfirm);
  const sanitizedUsername = sanitize(username);
  const errors = {};
  const { isEmail, isEmpty, isLength, matches } = validator;

  if (!isLength(sanitizedUsername, { min: 1, max: 32 })) {
    errors.nameError = 'authorization.input.username.invalid';
  }

  if (isEmpty(sanitizedEmail) || !isEmail(sanitizedEmail)) {
    errors.emailError = 'authorization.input.email.invalid';
  }

  if (!matches(sanitizedPassword, /^[^\s]{4,32}$/)) {
    errors.passwordError = 'authorization.input.password.invalid';
  }

  if (sanitizedPassword !== sanitizedPasswordConfirm) {
    errors.passwordConfirmError = 'authorization.input.password.not-match';
  }

  if (_some(errors, error => error !== undefined)) {
    return resp.status(406).send(errors);
  }

  User.findOne({ email: sanitizedEmail })
    .exec()
    .then(user => {
      if (user) {
        const { _id, displayName, email, idFromProvider, isActive } = user;

        if (!idFromProvider && !isActive) {
          const signUpHash = crypto.randomBytes(32).toString('hex');
          const expirationDate = new Date().getTime() + 3600000;

          return User.findOneAndUpdate(
            { _id },
            { signUpHash, signUpHashExpirationDate: expirationDate }
          )
            .exec()
            .then(user => {
              if (!user) {
                throw new Error();
              }

              return { displayName, email, signUpHash };
            });
        }

        throw new BadRequestException('authorization.user-already-exist');
      } else {
        const hashedPassword = bcrypt.hashSync(password + email, 12);
        const signUpHash = crypto.randomBytes(32).toString('hex');
        const expirationDate = new Date().getTime() + 3600000;
        const newUser = new User({
          displayName: sanitizedUsername,
          email: sanitizedEmail,
          isActive: false,
          password: hashedPassword,
          signUpHash,
          signUpHashExpirationDate: expirationDate
        });

        return newUser.save().then(user => {
          const { displayName, email, signUpHash } = user;

          return { displayName, email, signUpHash };
        });
      }
    })
    .then(dataToSend => {
      // eslint-disable-next-line no-param-reassign
      resp.locals = dataToSend;

      return next();
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { message } = err;

        return resp.status(400).send({ message });
      }

      resp.sendStatus(400);
    });
};

module.exports = {
  logout,
  sendDemoUser,
  sendUser,
  signUp
};
