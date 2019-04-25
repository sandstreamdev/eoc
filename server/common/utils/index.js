const { ObjectId } = require('mongoose').Types;
const _map = require('lodash/map');

const fromEntries = convertedArray =>
  convertedArray.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

const filter = f => object =>
  fromEntries(
    Object.entries(object).filter(([key, value]) => f(value, key, object))
  );

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
    const membersCount = [...memberIds].length;

    return {
      ...rest,
      isFavourite: isUserFavourite(favIds, userId),
      membersCount
    };
  });

const responseWithCohort = (cohort, userId) => {
  const { _id, description, favIds, memberIds, name } = cohort;
  const membersCount = [...memberIds].length;

  return {
    _id,
    description,
    isFavourite: isUserFavourite(favIds, userId),
    membersCount,
    name
  };
};

const checkRole = (idsArray, userIdFromReq) =>
  idsArray.indexOf(userIdFromReq) !== -1;

const checkIfOwner = (ownerIds, userId) =>
  ownerIds.indexOf(userId.toString()) > -1;

const checkIfGuest = (cohortMembersIds, userId) =>
  !cohortMembersIds.some(id => id.equals(userId));

const checkIfMember = (memberIds, userId) =>
  memberIds.indexOf(userId.toString()) > -1;

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

const responseWithCohortMember = (data, ownerIds) => {
  const { avatarUrl, displayName, newMemberId } = data;

  return {
    _id: newMemberId,
    avatarUrl,
    displayName,
    isOwner: checkIfOwner(ownerIds, newMemberId),
    isMember: true
  };
};

const responseWithListMember = (user, cohortMembers) => {
  const { avatarUrl, displayName, _id: newMemberId } = user;

  return {
    _id: newMemberId,
    avatarUrl,
    displayName,
    isGuest: checkIfGuest(cohortMembers, newMemberId),
    isMember: false,
    isOwner: false
  };
};

const responseWithListMembers = (
  viewers,
  memberIds,
  ownerIds,
  cohortMembersIds
) =>
  viewers.map(user => ({
    ...user._doc,
    isOwner: checkIfOwner(ownerIds, user._doc._id),
    isGuest: checkIfGuest(cohortMembersIds, user._doc._id),
    isMember: checkIfMember(memberIds, user._doc._id)
  }));

module.exports = {
  checkIfCohortMember,
  checkIfGuest,
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
