const { ObjectId } = require('mongoose').Types;
const _map = require('lodash/map');
const _pickBy = require('lodash/pickBy');
const _compact = require('lodash/compact');
const _keyBy = require('lodash/keyBy');

const fromEntries = convertedArray =>
  convertedArray.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

const filter = f => object =>
  fromEntries(
    Object.entries(object).filter(([key, value]) => f(value, key, object))
  );

const isValidMongoId = id => ObjectId.isValid(id);

const checkIfArrayContainsUserId = (idsArray, userId) => {
  const arrayOfStrings = idsArray.map(id => id.toString());
  const userIdAsString = userId.toString();

  return arrayOfStrings.indexOf(userIdAsString) !== -1;
};

const isOwner = (doc, userId) => {
  const { ownerIds } = doc;

  return checkIfArrayContainsUserId(ownerIds, userId);
};

const isMember = (doc, userId) => {
  const { memberIds } = doc;

  return checkIfArrayContainsUserId(memberIds, userId);
};

const isViewer = (doc, userId) => {
  const { viewersIds } = doc;

  return checkIfArrayContainsUserId(viewersIds, userId);
};

const responseWithList = (list, userId) => {
  const {
    _id,
    cohortId,
    created_at: createdAt,
    description,
    favIds,
    items,
    name,
    type
  } = list;
  const doneItemsCount = items.filter(item => item.isOrdered).length;
  const unhandledItemsCount = items.length - doneItemsCount;

  const listToSend = {
    _id,
    createdAt,
    description,
    doneItemsCount,
    isFavourite: checkIfArrayContainsUserId(favIds, userId),
    type,
    name,
    unhandledItemsCount
  };

  if (cohortId) {
    listToSend.cohortId =
      typeof cohortId === 'string' ? cohortId : cohortId._id;
  }

  return listToSend;
};

const responseWithListsMetaData = (lists, userId) =>
  _compact(
    _map(lists, list => {
      const {
        cohortId: cohort,
        favIds,
        items,
        created_at: createdAt,
        ...rest
      } = list;

      if (cohort && cohort.isArchived) {
        return;
      }

      const activeItems = items.filter(item => !item.isArchived);
      const doneItemsCount = activeItems.filter(item => item.isOrdered).length;
      const unhandledItemsCount = activeItems.length - doneItemsCount;

      const listToSend = {
        ...rest,
        createdAt,
        doneItemsCount,
        isFavourite: checkIfArrayContainsUserId(favIds, userId),
        unhandledItemsCount
      };

      if (cohort) {
        listToSend.cohortId = cohort._id;
      }

      return listToSend;
    })
  );

const responseWithItems = (userId, items) =>
  _map(items, item => {
    const { authorId: author, isArchived, voterIds, ...rest } = item;
    const { _id: authorId, displayName: authorName } = author;

    return {
      ...rest,
      authorId,
      authorName,
      isArchived,
      isVoted: checkIfArrayContainsUserId(voterIds, userId),
      votesCount: voterIds.length
    };
  });

const responseWithItem = (item, userId) => {
  const { authorId: author, isArchived, voterIds, ...rest } = item;
  const { _id: authorId, displayName: authorName } = author;

  return {
    ...rest,
    authorId,
    authorName,
    isArchived,
    isVoted: checkIfArrayContainsUserId(voterIds, userId),
    votesCount: voterIds.length
  };
};

const responseWithCohorts = cohorts =>
  _map(cohorts, cohort => {
    const { memberIds, ownerIds, ...rest } = cohort;
    const membersCount = memberIds.length;

    return {
      ...rest,
      membersCount
    };
  });

const responseWithCohort = cohort => {
  const { _id, createdAt, description, memberIds, name, isArchived } = cohort;
  const membersCount = memberIds.length;

  return {
    _id,
    createdAt,
    description,
    isArchived,
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

const responseWithCohortDetails = (doc, userId) => {
  const {
    _id,
    createdAt,
    description,
    isArchived,
    memberIds: membersCollection,
    name,
    ownerIds
  } = doc;

  const isOwner = checkIfArrayContainsUserId(ownerIds, userId);
  const members = _keyBy(
    responseWithCohortMembers(membersCollection, ownerIds),
    '_id'
  );

  return {
    _id,
    createdAt,
    description,
    isArchived,
    isMember: true,
    isOwner,
    members,
    name
  };
};

module.exports = {
  checkIfArrayContainsUserId,
  checkIfCohortMember,
  filter,
  isMember,
  isOwner,
  isValidMongoId,
  isViewer,
  responseWithCohort,
  responseWithCohortDetails,
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
