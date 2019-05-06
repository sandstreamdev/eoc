const { ObjectId } = require('mongoose').Types;
const _map = require('lodash/map');
const _pickBy = require('lodash/pickBy');

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
    const { _id, cohortId, description, favIds, isPrivate, items, name } = list;
    const doneItemsCount = items.filter(item => item.isOrdered).length;
    const unhandledItemsCount = items.length - doneItemsCount;

    return {
      _id,
      cohortId,
      description,
      doneItemsCount,
      isFavourite: isUserFavourite(favIds, userId),
      isPrivate,
      name,
      unhandledItemsCount
    };
  });

const checkIfCurrentUserVoted = (item, userId) =>
  item.voterIds.indexOf(userId) > -1;

const responseWithItems = (userId, list) => {
  const { items } = list;

  return _map(items, item => {
    const {
      _id,
      authorId,
      authorName,
      createdAt,
      description,
      isOrdered,
      link,
      name,
      updatedAt,
      voterIds
    } = item;

    return {
      _id,
      authorId,
      authorName,
      createdAt,
      description,
      isOrdered,
      link,
      name,
      updatedAt,
      isVoted: checkIfCurrentUserVoted(item, userId),
      votesCount: voterIds.length
    };
  });
};

const responseWithItem = (item, userId) => {
  const {
    _id,
    authorId,
    authorName,
    createdAt,
    description,
    isOrdered,
    link,
    name,
    updatedAt,
    voterIds
  } = item;

  return {
    _id,
    authorId,
    authorName,
    createdAt,
    description,
    isOrdered,
    isVoted: checkIfCurrentUserVoted(item, userId),
    link,
    name,
    updatedAt,
    votesCount: voterIds.length
  };
};

const responseWithCohorts = (cohorts, userId) =>
  _map(cohorts, cohort => {
    const { _id, description, favIds, isArchived, memberIds, name } = cohort;
    const membersCount = memberIds.length;

    return {
      _id,
      description,
      isArchived,
      isFavourite: isUserFavourite(favIds, userId),
      membersCount,
      name
    };
  });

const responseWithCohort = (cohort, userId) => {
  const { _id, description, favIds, memberIds, name, isArchived } = cohort;
  const membersCount = memberIds.length;

  return {
    _id,
    description,
    isArchived,
    isFavourite: isUserFavourite(favIds, userId),
    membersCount,
    name
  };
};

const checkIfArrayContainsUserId = (idsArray, userId) => {
  const arrayOfStrings = idsArray.map(id => id.toString());
  const userIdAsString = userId.toString();

  return arrayOfStrings.indexOf(userIdAsString) !== -1;
};

const checkIfGuest = (cohortMembersIds, userId) => {
  const idsArray = cohortMembersIds.map(id => id.toString());
  const userIdAsString = userId.toString();

  return idsArray.indexOf(userIdAsString) === -1;
};

const responseWithCohortMembers = (users, ownerIds) =>
  users.map(user => {
    const {
      _doc: { _id: userId }
    } = user;

    return {
      ...user._doc,
      isMember: true,
      isOwner: checkIfArrayContainsUserId(ownerIds, userId)
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

const responseWithCohortMember = (user, ownerIds) => {
  const { avatarUrl, displayName, newMemberId } = user;

  return {
    _id: newMemberId,
    avatarUrl,
    displayName,
    isMember: true,
    isOwner: checkIfArrayContainsUserId(ownerIds, newMemberId)
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
    isOwner: checkIfArrayContainsUserId(ownerIds, user._doc._id),
    isGuest: checkIfGuest(cohortMembersIds, user._doc._id),
    isMember: checkIfArrayContainsUserId(memberIds, user._doc._id)
  }));

/**
 * @param {*} subdocumentName - name of nested collection
 * @param {*} data - object of properties to update, properties
 * name need to match subdocument model
 * eg. To update description field within items collection
 * you need to generate {'items.$.description'} object.
 * You can do it like so: updateSubdocumentFields('items', {description});
 */
const updateSubdocumentFields = (subdocumentName, data) => {
  const filteredObject = _pickBy(data, el => el !== undefined);

  const dataToUpdate = {};
  for (let i = 0; i < Object.keys(filteredObject).length; i += 1) {
    dataToUpdate[
      `${subdocumentName}.$.${Object.keys(filteredObject)[i]}`
    ] = Object.values(filteredObject)[i];
  }

  return dataToUpdate;
};

module.exports = {
  checkIfArrayContainsUserId,
  checkIfCohortMember,
  checkIfCurrentUserVoted,
  checkIfGuest,
  filter,
  isUserFavourite,
  isValidMongoId,
  responseWithCohort,
  responseWithCohortMember,
  responseWithCohortMembers,
  responseWithCohorts,
  responseWithItem,
  responseWithItems,
  responseWithList,
  responseWithListMember,
  responseWithListMembers,
  responseWithLists,
  updateSubdocumentFields
};
