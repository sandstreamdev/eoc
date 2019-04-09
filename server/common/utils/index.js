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
    const { _id, description, favIds, memberIds, name, ownerIds } = _doc;
    const membersCount = [...memberIds, ...ownerIds].length;

    return {
      _id,
      description,
      isFavourite: isUserFavourite(favIds, userId),
      name,
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

const responseWithMembers = (users, ownerIds) =>
  users.map(user => ({
    ...user._doc,
    isOwner: ownerIds.indexOf(user._doc._id.toString()) > -1
  }));

const responseWithMember = (data, ownerIds) => {
  const { avatarUrl, displayName, newMemberId } = data;

  return {
    _id: newMemberId,
    avatarUrl,
    displayName,
    isOwner: ownerIds.indexOf(newMemberId.toString()) > -1
  };
};

module.exports = {
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
  responseWithMember,
  responseWithMembers
};
