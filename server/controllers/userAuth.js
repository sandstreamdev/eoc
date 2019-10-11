const sanitize = require('mongo-sanitize');
const validator = require('validator');
const _some = require('lodash/some');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const _trim = require('lodash/trim');

const BadRequestException = require('../common/exceptions/BadRequestException');
const ValidationException = require('../common/exceptions/ValidationException');
const User = require('../models/user.model');
const {
  responseWithUserData,
  validatePassword
} = require('../common/utils/userUtils');
const Settings = require('../models/settings.model');
const { BadRequestReason, EXPIRATION_TIME } = require('../common/variables');
const Cohort = require('../models/cohort.model');
const List = require('../models/list.model');
const { isMember, isOwner } = require('../common/utils');
const io = require('../sockets/index');
const { leaveList } = require('../sockets/list');
const { leaveCohort } = require('../sockets/cohort');
const { logout: logoutOtherSessions } = require('../sockets/user');

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
          const hashedPassword = bcrypt.hashSync(password + email, 12);
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

      const hashedPassword = bcrypt.hashSync(password + email, 12);
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
          resp.locales = {
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
        password: bcrypt.hashSync(updatedPassword + email, 12),
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

const getUserDetails = (req, resp) => {
  const { user } = req;

  if (user) {
    const { activatedAt, createdAt, email, password } = user;
    const activationDate = activatedAt || createdAt;
    const isPasswordSet = password !== undefined;

    return resp.send({ activationDate, email, isPasswordSet });
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

  User.findOne({ email }, 'password')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new Error();
      }

      const { password: dbPassword } = doc;

      if (!bcrypt.compareSync(password + email, dbPassword)) {
        throw new ValidationException();
      }

      const newHashedPassword = bcrypt.hashSync(newPassword + email, 12);

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

const deleteAccount = async (req, resp) => {
  const { email, password } = req.body;
  const sanitizedEmail = sanitize(email);
  const socketInstance = io.getInstance();

  try {
    const user = await User.findOne({ email: sanitizedEmail, isActive: true });
    const { _id: userId, displayName, password: dbPassword, createdAt } = user;

    if (bcrypt.compareSync(password + email, dbPassword)) {
      // check if he is the only owner and send error
      const listsOnlyOwner = await List.find(
        {
          $and: [{ ownerIds: userId }, { ownerIds: { $size: 1 } }],
          'viewersIds.1': { $exists: true }
        },
        'name'
      )
        .lean()
        .exec();

      const cohortsOnlyOwner = await Cohort.find(
        {
          $and: [{ ownerIds: userId }, { ownerIds: { $size: 1 } }],
          'memberIds.1': { $exists: true }
        },
        'name'
      )
        .lean()
        .exec();

      if (cohortsOnlyOwner.length >= 1 || listsOnlyOwner.length >= 1) {
        const data = { cohorts: cohortsOnlyOwner, lists: listsOnlyOwner };

        return resp
          .status(400)
          .send({ reason: BadRequestReason.REQUIREMENTS, data });
      }

      // delete account details
      const hashedEmail = bcrypt.hashSync(email, 12);
      const removedUser = new User({
        _id: userId,
        createdAt,
        email: hashedEmail,
        updatedAt: new Date()
      });

      await User.deleteOne({ email: sanitizedEmail });
      await removedUser.save();

      // delete user's lists where he is the only viewer
      await List.updateMany(
        { viewersIds: userId, 'viewersIds.1': { $exists: false } },
        {
          isArchived: true,
          isDeleted: true
        }
      ).exec();

      // remove user from other lists
      const lists = await List.find({ viewersIds: userId });
      const listPromises = [];

      lists.forEach(async list => {
        const { _id, memberIds, ownerIds, viewersIds } = list;
        const data = { listId: _id, performer: displayName, userId };

        viewersIds.splice(viewersIds.indexOf(userId), 1);

        if (isMember(list, userId)) {
          memberIds.splice(memberIds.indexOf(userId), 1);
        }

        if (isOwner(list, userId)) {
          ownerIds.splice(ownerIds.indexOf(userId), 1);
        }

        listPromises.push(list.save(), leaveList(socketInstance)(data));
      });

      await Promise.all(listPromises);

      // delete user's own cohorts where he is the only member
      await Cohort.updateMany(
        { memberIds: userId, 'memberIds.1': { $exists: false } },
        {
          isArchived: true,
          isDeleted: true
        }
      ).exec();

      // remove user form other cohorts
      const cohorts = await Cohort.find({ memberIds: userId });
      const cohortPromises = [];

      cohorts.forEach(async cohort => {
        const { _id: cohortId, memberIds, ownerIds } = cohort;

        memberIds.splice(memberIds.indexOf(userId), 1);

        if (isOwner(cohort, userId)) {
          ownerIds.splice(ownerIds.indexOf(userId), 1);
        }

        const data = {
          cohortId,
          membersCount: memberIds.length,
          performer: displayName,
          userId
        };

        cohortPromises.push(cohort.save(), leaveCohort(socketInstance)(data));
      });

      await Promise.all(cohortPromises);

      // destroy user's sessions
      const {
        sessionStore: store,
        sessionStore: { db }
      } = req;
      const regexp = new RegExp(userId);

      // logout from other sessions/devices
      await logoutOtherSessions(socketInstance)(userId);

      await db
        .collection('sessions')
        .find({ session: regexp })
        .forEach(({ _id }) => store.destroy(_id));

      req.logout();
      resp.clearCookie('connect.sid');

      return resp.send();
    }
    throw new Error();
  } catch {
    resp.sendStatus(400);
  }
};

module.exports = {
  changePassword,
  checkToken,
  confirmEmail,
  deleteAccount,
  getAccountDetails,
  getLoggedUser,
  getUserDetails,
  logout,
  recoveryPassword,
  resendSignUpConfirmationLink,
  resetPassword,
  sendUser,
  signUp,
  updatePassword
};
