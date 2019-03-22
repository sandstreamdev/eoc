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
    description: list.description,
    name: list.name,
    cohortId: list.cohortId && list.cohortId,
    isArchived: list.isArchived && list.isArchived,
    isFavourite: list.favIds && isUserFavourite(list, userId)
  }));

module.exports = {
  checkRole,
  filter,
  isUserFavourite,
  isValidMongoId,
  responseWithLists
};
