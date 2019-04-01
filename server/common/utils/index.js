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

const responseWithUsers = (users, ownerIds) =>
  users.map(user => ({
    ...user._doc,
    isOwner: ownerIds.indexOf(user._doc._id.toString()) > -1
  }));

const responseWithUser = data => {
  const { avatarUrl, displayName, newMemberId } = data;
  return {
    _id: newMemberId,
    avatarUrl,
    displayName,
    isOwner: false
  };
};

module.exports = {
  checkRole,
  filter,
  isUserFavourite,
  isValidMongoId,
  responseWithCohorts,
  responseWithItem,
  responseWithItems,
  responseWithLists,
  responseWithUser,
  responseWithUsers
};
