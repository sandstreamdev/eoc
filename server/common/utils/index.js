const { ObjectId } = require('mongoose').Types;
const _map = require('lodash/map');

const fromEntries = convertedArray =>
  convertedArray.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

const filter = f => object =>
  fromEntries(
    Object.entries(object).filter(([key, value]) => f(value, key, object))
  );

const checkRole = (idsArray, userIdFromReq) => {
  const userId = ObjectId(userIdFromReq);
  return idsArray.some(id => id.equals(userId));
};

const isValidMongoId = id => ObjectId.isValid(id);

const isUserFavourite = (favIds, userId) => favIds.indexOf(userId) > -1;

const responseWithLists = (lists, userId) =>
  _map(lists, ({ favIds, ...rest }) => ({
    ...rest._doc,
    isFavourite: isUserFavourite(favIds, userId)
  }));

const checkIfCurrentUserVoted = (item, userId) =>
  item.voterIds.indexOf(userId) > -1;

const responseWithItems = (userId, list) => {
  const { items } = list;

  return _map(items, item => {
    const { voterIds, ...rest } = item.toObject();

    return {
      ...rest,
      isVoted: checkIfCurrentUserVoted(item, userId),
      votesCount: voterIds.length
    };
  });
};

const responseWithItem = (item, userId) => {
  const { voterIds, ...rest } = item.toObject();

  return {
    ...rest,
    isVoted: checkIfCurrentUserVoted(item, userId),
    votesCount: voterIds.length
  };
};

const responseWithCohorts = (cohorts, userId) =>
  _map(cohorts, ({ _doc }) => {
    const { favIds, ...rest } = _doc;

    return {
      ...rest,
      isFavourite: isUserFavourite(favIds, userId)
    };
  });

const checkIfOwner = (ownerIds, userId) =>
  ownerIds.indexOf(userId.toString()) > -1;

const responseWithCohortMembers = (users, ownerIds) =>
  users.map(user => {
    const {
      _doc: { _id: userId }
    } = user;

    return {
      ...user._doc,
      isOwner: checkIfOwner(ownerIds, userId)
    };
  });

const checkIfCohortMember = (cohort, userId) => {
  if (cohort) {
    const { memberIds, ownerIds } = cohort;
    const convertedUserId = ObjectId(userId);
    return [...memberIds, ...ownerIds].some(id => id.equals(convertedUserId));
  }

  return false;
};

const checkIfGuest = (data, userId) => {
  if (data) {
    return data.constructor === Array
      ? !data.some(member => member._id.equals(userId))
      : ![...data.memberIds, ...data.ownerIds].some(id => id.equals(userId));
  }

  return true;
};

const responseWithCohortMember = (data, ownerIds) => {
  const { avatarUrl, displayName, newMemberId } = data;

  return {
    _id: newMemberId,
    avatarUrl,
    displayName,
    isOwner: checkIfOwner(ownerIds, newMemberId)
  };
};

const responseWithListMember = (data, ownerIds, cohort) => {
  const { avatarUrl, displayName, newMemberId } = data;

  return {
    _id: newMemberId,
    avatarUrl,
    displayName,
    isGuest: checkIfGuest(cohort, newMemberId),
    isOwner: checkIfOwner(ownerIds, newMemberId)
  };
};

const responseWithListMembers = (users, ownerIds, cohortMembers) =>
  users.map(user => ({
    ...user._doc,
    isOwner: checkIfOwner(ownerIds, user._doc._id),
    isGuest: checkIfGuest(cohortMembers, user._doc._id)
  }));

const uniqueMembers = (cohortMembers, listMembers) =>
  Object.values(
    [...cohortMembers, ...listMembers].reduce((prev, member) => {
      prev[member._id] = member; // eslint-disable-line no-param-reassign
      return prev;
    }, {})
  );

module.exports = {
  uniqueMembers,
  checkIfCohortMember,
  checkRole,
  filter,
  isUserFavourite,
  isValidMongoId,
  responseWithCohorts,
  responseWithItem,
  responseWithItems,
  responseWithLists,
  responseWithCohortMember,
  responseWithListMember,
  responseWithListMembers,
  responseWithCohortMembers
};
