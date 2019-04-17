const { ObjectId } = require('mongoose').Types;
const _map = require('lodash/map');
const _isArray = require('lodash/isArray');

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

const responseWithList = (list, userId) => {
  const { _id, cohortId, description, favIds, isPrivate, items, name } = list;
  const doneItemsCount = items.filter(item => item.isOrdered).length;
  const unhandledItemsCount = items.length - doneItemsCount;

  const listToSend = {
    _id,
    description,
    doneItemsCount,
    isFavourite: isUserFavourite(favIds, userId),
    isPrivate,
    name,
    unhandledItemsCount
  };

  if (cohortId) {
    listToSend.cohortId = cohortId;
  }

  return listToSend;
};

const responseWithLists = (lists, userId) =>
  _map(lists, list => {
    const { favIds, items, ...rest } = list._doc;
    const doneItemsCount = items.filter(item => item.isOrdered).length;
    const unhandledItemsCount = items.length - doneItemsCount;

    return {
      ...rest,
      doneItemsCount,
      isFavourite: isUserFavourite(favIds, userId),
      unhandledItemsCount
    };
  });

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
    const { favIds, memberIds, ownerIds, ...rest } = _doc;
    const membersCount = [...memberIds, ...ownerIds].length;

    return {
      ...rest,
      isFavourite: isUserFavourite(favIds, userId),
      membersCount
    };
  });

const responseWithCohort = (cohort, userId) => {
  const { _id, description, favIds, memberIds, name, ownerIds } = cohort;
  const membersCount = [...memberIds, ...ownerIds].length;

  return {
    _id,
    description,
    isFavourite: isUserFavourite(favIds, userId),
    membersCount,
    name
  };
};

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
    return _isArray(data)
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

const responseWithListMember = (data, ownerIds, cohortId) => {
  const { avatarUrl, displayName, newMemberId } = data;

  // TODO: check if is member TODO:
  return {
    _id: newMemberId,
    avatarUrl,
    displayName,
    isGuest: checkIfGuest(cohortId, newMemberId),
    isOwner: checkIfOwner(ownerIds, newMemberId)
  };
};

const responseWithListMembers = (users, ownerIds, cohortMembers) =>
  users.map(user => ({
    ...user._doc,
    isOwner: checkIfOwner(ownerIds, user._doc._id),
    isGuest: checkIfGuest(cohortMembers, user._doc._id)
  }));

/**
 *  This method returns array with no duplicated user's ids. Duplicates of user's
 *  ids may occur in the cohort's public list case because in that case cohort's
 *  and list's members arrays have to be merged.
 */
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
  responseWithCohort,
  responseWithCohorts,
  responseWithItem,
  responseWithItems,
  responseWithList,
  responseWithLists,
  responseWithCohortMember,
  responseWithListMember,
  responseWithListMembers,
  responseWithCohortMembers
};
