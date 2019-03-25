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

const isUserFavourite = (list, userId) => list.favIds.indexOf(userId) > -1;

const responseWithLists = (lists, userId) =>
  _map(lists, list => ({
    _id: list._id,
    cohortId: list.cohortId && list.cohortId,
    description: list.description,
    isArchived: list.isArchived && list.isArchived,
    isFavourite: list.favIds && isUserFavourite(list, userId),
    name: list.name
  }));

const checkIfCurrentUserVoted = (item, userId) =>
  item.voterIds.indexOf(userId) > -1;

const reponseWithItems = (userId, list) => {
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

module.exports = {
  checkRole,
  filter,
  reponseWithItems,
  isUserFavourite,
  isValidMongoId,
  responseWithItem,
  responseWithLists
};
