const sanitize = require('mongo-sanitize');
const validator = require('validator');
const _some = require('lodash/some');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const _trim = require('lodash/trim');
const _isEmpty = require('lodash/isEmpty');

const BadRequestException = require('../common/exceptions/BadRequestException');
const ValidationException = require('../common/exceptions/ValidationException');
const User = require('../models/user.model');
const List = require('../models/list.model');
const {
  checkIfUserIsTheOnlyOwner,
  deleteAccountDetails,
  deleteUserCohorts,
  deleteUserLists,
  destroyUserSessions,
  removeUserFromCohorts,
  removeUserFromLists,
  responseWithUserData,
  validatePassword
} = require('../common/utils/userUtils');
const Settings = require('../models/settings.model');
const {
  BadRequestReason,
  BCRYPT_SALT_ROUNDS,
  EXPIRATION_TIME
} = require('../common/variables');
const { getItemsForReport } = require('../common/utils/helpers');
const Cohort = require('../models/cohort.model');
const io = require('../sockets/index');
const { logout: logoutOtherSessions } = require('../sockets/user');
const mailer = require('../mailer/index');

const demoRedirect = (req, resp) => resp.redirect('/');

const sendUser = (req, resp) => resp.send(responseWithUserData(req.user));

const logout = (req, resp) => {
  req.session.destroy(() => {
    req.logout();

    resp.clearCookie('connect.sid');
    resp.redirect('/');
  });
};

const signUp = (req, resp, next) => {
  const { email, password, passwordConfirm, username } = req.body;
  const sanitizedEmail = sanitize(email);
  const sanitizedUsername = sanitize(username);
  const errors = {};
  const { isEmail, isLength } = validator;

  if (!isLength(sanitizedUsername, { min: 1, max: 32 })) {
    errors.isNameError = true;
  }

  if (!isEmail(sanitizedEmail)) {
    errors.isEmailError = true;
  }

  if (!validatePassword(password)) {
    errors.isPasswordError = true;
  }

  if (password !== passwordConfirm) {
    errors.isConfirmPasswordError = true;
  }

  if (_some(errors, error => error !== undefined)) {
    return resp
      .status(400)
      .send({ reason: BadRequestReason.VALIDATION, errors });
  }

  User.findOne({ email: sanitizedEmail })
    .exec()
    .then(user => {
      if (user) {
        const { _id, displayName, email, idFromProvider, isActive } = user;

        if (!idFromProvider && !isActive) {
          const hashedPassword = bcrypt.hashSync(
            password + email,
            BCRYPT_SALT_ROUNDS
          );
          const signUpHash = crypto.randomBytes(32).toString('hex');
          const expirationDate = new Date().getTime() + EXPIRATION_TIME;

          return User.findOneAndUpdate(
            { _id },
            {
              displayName: sanitizedUsername,
              password: hashedPassword,
              signUpHash,
              signUpHashExpirationDate: expirationDate
            }
          )
            .exec()
            .then(user => {
              if (!user) {
                throw new Error();
              }

              return { displayName, email, signUpHash };
            });
        }

        throw new BadRequestException(
          'user.actions.sign-up.user-already-exist'
        );
      }

      const hashedPassword = bcrypt.hashSync(
        password + email,
        BCRYPT_SALT_ROUNDS
      );
      const signUpHash = crypto.randomBytes(32).toString('hex');
      const expirationDate = new Date().getTime() + EXPIRATION_TIME;
      const newUser = new User({
        displayName: sanitizedUsername,
        email: sanitizedEmail,
        isActive: false,
        password: hashedPassword,
        settings: new Settings(),
        signUpHash,
        signUpHashExpirationDate: expirationDate
      });

      return newUser.save().then(user => {
        const { displayName, email, signUpHash } = user;

        return { displayName, email, signUpHash };
      });
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

const confirmEmail = (req, resp) => {
  const { hash: signUpHash } = req.params;

  User.findOneAndUpdate(
    {
      signUpHash,
      signUpHashExpirationDate: { $gte: new Date() }
    },
    {
      activatedAt: new Date(),
      isActive: true,
      signUpHash: null,
      signUpHashExpirationDate: null
    }
  )
    .lean()
    .exec()
    .then(user => {
      if (!user) {
        throw new Error();
      }
      resp.redirect('/account-created');
    })
    .catch(() => resp.redirect(`/confirmation-link-expired/${signUpHash}`));
};

const resendSignUpConfirmationLink = (req, resp, next) => {
  const { hash } = req.body;
  const sanitizedHash = sanitize(hash);

  User.findOneAndUpdate(
    {
      signUpHash: sanitizedHash,
      isActive: false
    },
    {
      signUpHash: crypto.randomBytes(32).toString('hex'),
      signUpHashExpirationDate: new Date().getTime() + EXPIRATION_TIME
    },
    { new: true }
  )
    .lean()
    .exec()
    .then(user => {
      if (!user) {
        throw new Error();
      }

      const { displayName, email, signUpHash } = user;

      // eslint-disable-next-line no-param-reassign
      resp.locals = { displayName, email, signUpHash };

      next();
    })
    .catch(() => resp.sendStatus(400));
};

const getLoggedUser = (req, resp) => {
  if (req.user) {
    return resp.send(responseWithUserData(req.user));
  }

  return resp.sendStatus(204);
};

const resetPassword = (req, resp, next) => {
  const { email } = req.body;
  const sanitizedEmail = sanitize(email);
  const { isEmail } = validator;

  if (!isEmail(sanitizedEmail)) {
    return resp.status(400).send({ reason: BadRequestReason.VALIDATION });
  }

  User.findOne({ email: sanitizedEmail })
    .exec()
    .then(user => {
      if (!user) {
        return resp.send();
      }

      const { displayName, isActive, idFromProvider } = user;

      if (!idFromProvider && !isActive) {
        return resp.send();
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpirationDate = new Date().getTime() + EXPIRATION_TIME;

      return User.findOneAndUpdate(
        {
          email: sanitizedEmail
        },
        { resetToken, resetTokenExpirationDate }
      )
        .exec()
        .then(() => {
          // eslint-disable-next-line no-param-reassign
          resp.locals = {
            displayName,
            email,
            resetToken
          };

          next();
        });
    })
    .catch(() => resp.sendStatus(400));
};

const recoveryPassword = (req, resp) => {
  const { token: resetToken } = req.params;

  User.findOne({
    resetToken,
    resetTokenExpirationDate: { $gte: new Date() }
  })
    .lean()
    .exec()
    .then(user => {
      if (!user) {
        throw new Error();
      }
      resp.redirect(`/password-recovery/${resetToken}`);
    })
    .catch(() => resp.redirect('/reset-password/token-expired'));
};

const updatePassword = (req, resp) => {
  const { password: updatedPassword, passwordConfirmation } = req.body;
  const { token } = req.params;

  const sanitizedToken = sanitize(token);
  const trimmedPassword = _trim(updatedPassword);
  const trimmedPasswordConfirmation = _trim(passwordConfirmation);

  if (
    !validatePassword(updatedPassword) ||
    trimmedPassword !== trimmedPasswordConfirmation
  ) {
    return resp.sendStatus(400);
  }

  User.findOne({ resetToken: sanitizedToken })
    .exec()
    .then(user => {
      if (!user) {
        throw new Error();
      }

      const {
        createdAt,
        email,
        idFromProvider,
        isActive,
        resetTokenExpirationDate
      } = user;
      const now = new Date().getTime();

      if (resetTokenExpirationDate < now) {
        resp.redirect(`/recovery-link-expired/${token}`);

        throw new Error();
      }

      const dataUpdate = {
        password: bcrypt.hashSync(updatedPassword + email, BCRYPT_SALT_ROUNDS),
        resetToken: null,
        resetTokenExpirationDate: null
      };

      if (idFromProvider && !isActive) {
        dataUpdate.activatedAt = createdAt;
        dataUpdate.isActive = true;
      }

      return User.findOneAndUpdate(
        { resetToken: sanitizedToken },
        dataUpdate
      ).exec();
    })
    .then(() => resp.sendStatus(200))
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { message } = err;

        resp.status(400).send({ message });
      }

      resp.sendStatus(400);
    });
};

const updateName = async (req, resp) => {
  const { userId, updatedName } = req.body;
  const { _id } = req.user;

  if (userId !== _id.toString()) {
    return resp.sendStatus(400);
  }

  try {
    await User.findOneAndUpdate({ _id }, { displayName: updatedName }).exec();

    resp.sendStatus(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return resp.sendStatus(400);
  }
};

const getUserDetails = (req, resp) => {
  const { user } = req;

  if (user) {
    const {
      activatedAt,
      createdAt,
      email,
      emailReportsFrequency,
      password
    } = user;
    const activationDate = activatedAt || createdAt;
    const isPasswordSet = password !== undefined;

    return resp.send({
      activationDate,
      email,
      emailReportsFrequency,
      isPasswordSet
    });
  }

  return resp.sendStatus(400);
};

const changePassword = (req, res) => {
  const { password, newPassword, newPasswordConfirm } = req.body;
  const errors = {};
  const { email, _id: userId } = req.user;

  errors.isNewPasswordError = !validatePassword(newPassword);
  errors.isNewConfirmPasswordError = newPassword !== newPasswordConfirm;

  if (_some(errors, error => error)) {
    return res
      .status(400)
      .send({ reason: BadRequestReason.VALIDATION, errors });
  }

  User.findOne({ _id: userId, email }, 'password')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new Error();
      }

      const { password: dbPassword } = doc;

      if (!bcrypt.compareSync(password + email, dbPassword)) {
        throw new ValidationException();
      }

      const newHashedPassword = bcrypt.hashSync(
        newPassword + email,
        BCRYPT_SALT_ROUNDS
      );

      // eslint-disable-next-line no-param-reassign
      doc.password = newHashedPassword;

      return doc.save();
    })
    .then(() => {
      const {
        sessionID,
        sessionStore: store,
        sessionStore: { db }
      } = req;
      const regexp = new RegExp(userId);

      return db
        .collection('sessions')
        .find({
          _id: { $ne: sessionID },
          session: regexp
        })
        .forEach(({ _id }) => store.destroy(_id));
    })
    .then(() => res.send())
    .catch(err => {
      if (err instanceof ValidationException) {
        const { status } = err;

        return res.status(status).send({ reason: BadRequestReason.VALIDATION });
      }
      res.sendStatus(400);
    });
};

const getAccountDetails = (req, resp) => {
  const {
    params: { token }
  } = req;

  User.findOne({ resetToken: token })
    .lean()
    .exec()
    .then(user => {
      if (user) {
        const { displayName, email } = user;

        return resp.send({ displayName, email });
      }

      resp.sendStatus(400);
    })
    .catch(() => resp.sendStatus(400));
};

const checkToken = (req, resp) => {
  const {
    params: { token }
  } = req;

  User.findOne({ resetToken: token })
    .lean()
    .exec()
    .then(user => resp.sendStatus(user ? 200 : 400))
    .catch(() => resp.sendStatus(400));
};

const checkIfDataLeft = async (req, resp) => {
  const { _id: userId } = req.user;

  try {
    const errors = await checkIfUserIsTheOnlyOwner(List, Cohort, userId);

    if (!_isEmpty(errors)) {
      return resp
        .status(400)
        .send({ reason: BadRequestReason.VALIDATION, errors });
    }

    resp.sendStatus(200);
  } catch {
    resp.sendStatus(400);
  }
};

const deleteAccount = async (req, resp) => {
  const { deleteToken } = req.params;
  const socketInstance = io.getInstance();

  try {
    const user = await User.findOne({
      deleteToken,
      deleteTokenExpirationDate: { $gte: new Date() }
    });

    if (user) {
      const { _id: userId, displayName } = user;

      await deleteAccountDetails(User, user);
      await deleteUserLists(List, userId);
      await removeUserFromLists(socketInstance)(List, displayName, userId);
      await deleteUserCohorts(Cohort, userId);
      await removeUserFromCohorts(socketInstance)(Cohort, displayName, userId);
      await logoutOtherSessions(socketInstance)(userId);
      await destroyUserSessions(req.sessionStore, userId);

      req.logout();
      resp.clearCookie('connect.sid');

      return resp.redirect('/account-deleted');
    }

    resp.redirect('/delete-link-expired');
  } catch {
    resp.sendStatus(400);
  }
};

const sendDeleteAccountMail = async (req, resp) => {
  const { _id, email } = req.user;

  try {
    const deleteToken = crypto.randomBytes(32).toString('hex');
    const deleteTokenExpirationDate = new Date().getTime() + EXPIRATION_TIME;

    const user = await User.findOneAndUpdate(
      { _id },
      { deleteToken, deleteTokenExpirationDate }
    );

    if (!user) {
      return resp.sendStatus(400);
    }

    const data = {
      deleteToken,
      email,
      req
    };

    await mailer.sendDeleteAccountMail(data);

    resp.sendStatus(200);
  } catch {
    resp.sendStatus(400);
  }
};

const prepareItems = async (req, resp, next) => {
  const { user } = req;

  try {
    const data = await getItemsForReport(List, user);

    /* eslint-disable-next-line no-param-reassign */
    resp.locals = data;

    next();
  } catch {
    resp.sendStatus(400);
  }
};

const updateEmailReportSettings = async (req, resp) => {
  const { _id } = req.user;
  const { emailReportsFrequency } = req.body;

  try {
    await User.findOneAndUpdate(
      { _id },
      {
        emailReportsFrequency
      }
    ).exec();

    resp.send();
  } catch {
    resp.send(400);
  }
};

module.exports = {
  changePassword,
  checkIfDataLeft,
  checkToken,
  confirmEmail,
  deleteAccount,
  demoRedirect,
  getAccountDetails,
  getLoggedUser,
  getUserDetails,
  logout,
  prepareItems,
  recoveryPassword,
  resendSignUpConfirmationLink,
  resetPassword,
  sendDeleteAccountMail,
  sendUser,
  signUp,
  updateEmailReportSettings,
  updateName,
  updatePassword
};
