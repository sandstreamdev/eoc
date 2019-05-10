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
  const { _id, cohortId, description, favIds, items, name, type } = list;
  const doneItemsCount = items.filter(item => item.isOrdered).length;
  const unhandledItemsCount = items.length - doneItemsCount;

  const listToSend = {
    _id,
    description,
    doneItemsCount,
    isFavourite: isUserFavourite(favIds, userId),
    type,
    name,
    unhandledItemsCount
  };

  if (cohortId) {
    listToSend.cohortId = cohortId;
  }

  return listToSend;
};

const responseWithListsMetaData = (lists, userId) =>
  _map(lists, list => {
    const { cohortId, favIds, items, ...rest } = list;
    const doneItemsCount = items.filter(item => item.isOrdered).length;
    const unhandledItemsCount = items.length - doneItemsCount;

    const listToSend = {
      ...rest,
      doneItemsCount,
      isFavourite: isUserFavourite(favIds, userId),
      unhandledItemsCount
    };

    if (cohortId) {
      listToSend.cohortId = cohortId;
    }

    return listToSend;
  });

const checkIfArrayContainsUserId = (idsArray, userId) => {
  const arrayOfStrings = idsArray.map(id => id.toString());
  const userIdAsString = userId.toString();

  return arrayOfStrings.indexOf(userIdAsString) !== -1;
};

const responseWithItems = (userId, list) => {
  const { items } = list;

  return _map(items, item => {
    const { voterIds, ...rest } = item;

    return {
      ...rest,
      isVoted: checkIfArrayContainsUserId(voterIds, userId),
      votesCount: voterIds.length
    };
  });
};

const responseWithItem = (item, userId) => {
  const { voterIds, ...rest } = item;

  return {
    ...rest,
    isVoted: checkIfArrayContainsUserId(voterIds, userId),
    votesCount: voterIds.length
  };
};

const responseWithCohorts = (cohorts, userId) =>
  _map(cohorts, cohort => {
    const { favIds, memberIds, ownerIds, ...rest } = cohort;
    const membersCount = memberIds.length;

    return {
      ...rest,
      isFavourite: isUserFavourite(favIds, userId),
      membersCount
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

const responseWithCohortMembers = (users, ownerIds) =>
  _map(users, user => {
    const { _id, avatarUrl, displayName } = user;

    return {
      _id,
      avatarUrl,
      displayName,
      isMember: true,
      isOwner: checkIfArrayContainsUserId(ownerIds, _id)
    };
  });

const checkIfCohortMember = (cohort, userId) => {
  if (cohort) {
    const { memberIds, ownerIds } = cohort;
    const userIdAsString = userId.toString();

    return (
      [...memberIds, ...ownerIds]
        .map(id => id.toString())
        .indexOf(userIdAsString) !== -1
    );
  }

  return false;
};

const responseWithCohortMember = (user, ownerIds) => {
  const { avatarUrl, displayName, _id } = user;

  return {
    _id,
    avatarUrl,
    displayName,
    isMember: true,
    isOwner: checkIfArrayContainsUserId(ownerIds, _id)
  };
};

const responseWithListMember = (user, cohortMembersIds) => {
  const { avatarUrl, displayName, _id: newMemberId } = user;

  return {
    _id: newMemberId,
    avatarUrl,
    displayName,
    isGuest: !checkIfArrayContainsUserId(cohortMembersIds, newMemberId),
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
  viewers.map(user => {
    const { _id, avatarUrl, displayName } = user;

    return {
      _id,
      avatarUrl,
      displayName,
      isOwner: checkIfArrayContainsUserId(ownerIds, _id),
      isGuest: !checkIfArrayContainsUserId(cohortMembersIds, _id),
      isMember: checkIfArrayContainsUserId(memberIds, _id)
    };
  });

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

const responseWithComment = (comment, avatarUrl, displayName) => {
  const { _id, authorId, createdAt, itemId, text } = comment;

  return {
    _id,
    authorAvatarUrl: avatarUrl,
    authorId,
    authorName: displayName,
    createdAt,
    itemId,
    text
  };
};

const responseWithComments = comments =>
  _map(comments, comment => {
    const {
      authorId: {
        _id: authorId,
        displayName: authorName,
        avatarUrl: authorAvatarUrl
      },
      ...rest
    } = comment;

    return {
      authorAvatarUrl,
      authorId,
      authorName,
      ...rest
    };
  });

module.exports = {
  checkIfArrayContainsUserId,
  checkIfCohortMember,
  filter,
  isUserFavourite,
  isValidMongoId,
  responseWithCohort,
  responseWithCohortMember,
  responseWithCohortMembers,
  responseWithCohorts,
  responseWithComment,
  responseWithComments,
  responseWithItem,
  responseWithItems,
  responseWithList,
  responseWithListMember,
  responseWithListMembers,
  responseWithListsMetaData,
  updateSubdocumentFields
};
