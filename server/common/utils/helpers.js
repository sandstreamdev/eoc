const { ObjectId } = require('mongoose').Types;
const _map = require('lodash/map');
const _pickBy = require('lodash/pickBy');
const _compact = require('lodash/compact');
const _keyBy = require('lodash/keyBy');
const _forEach = require('lodash/forEach');
const sanitize = require('mongo-sanitize');

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

const countItems = items => {
  const activeItems = items.filter(item => !item.isArchived);
  const doneItemsCount = activeItems.filter(item => item.done).length;
  const unhandledItemsCount = activeItems.length - doneItemsCount;

  return { doneItemsCount, unhandledItemsCount };
};

const responseWithListMetaData = (list, userId) => {
  const {
    _id,
    cohortId,
    createdAt,
    description,
    favIds,
    items,
    locks,
    name,
    type
  } = list;

  const listToSend = {
    _id,
    createdAt,
    description,
    ...countItems(items),
    isGuest: !cohortId || (cohortId && !isMember(cohortId, userId)),
    isMember: isMember(list, userId),
    isOwner: isOwner(list, userId),
    locks,
    name,
    type
  };

  if (userId) {
    listToSend.isFavourite = checkIfArrayContainsUserId(favIds, userId);
  }

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
        memberIds,
        ownerIds,
        ...rest
      } = list;

      if (cohort && cohort.isArchived) {
        return;
      }

      const listToSend = {
        ...rest,
        ...countItems(items),
        isGuest: !cohort || (cohort && !isMember(cohort, userId)),
        isMember: isMember(list, userId),
        isOwner: isOwner(list, userId)
      };

      if (userId) {
        listToSend.isFavourite = checkIfArrayContainsUserId(favIds, userId);
      }

      if (cohort) {
        listToSend.cohortId = cohort._id;
      }

      return listToSend;
    })
  );

const responseWithItems = (userId, items) =>
  _map(items, item => {
    const {
      authorId: author,
      editedBy,
      isArchived,
      isDeleted,
      voterIds,
      ...rest
    } = item;
    const { _id: authorId, displayName: authorName } = author;
    const { displayName: editorDisplayName } = editedBy || {};

    return {
      ...rest,
      animate: false,
      authorId,
      authorName,
      editedBy: editorDisplayName,
      isArchived,
      isVoted: checkIfArrayContainsUserId(voterIds, userId),
      votesCount: voterIds.length
    };
  });

const responseWithItem = (item, userId) => {
  const {
    authorId: author,
    editedBy: editor,
    isArchived,
    isDeleted,
    voterIds,
    ...rest
  } = item;
  const { _id: authorId, displayName: authorName } = author;
  const newItem = {
    ...rest,
    animate: false,
    authorId,
    authorName,
    editedBy: editor ? editor.displayName : '',
    isArchived,
    votesCount: voterIds.length
  };

  if (userId) {
    newItem.isVoted = checkIfArrayContainsUserId(voterIds, userId);
  }

  return newItem;
};

const responseWithCohorts = (cohorts, userId) =>
  _map(cohorts, cohort => {
    const { isDeleted, memberIds, ownerIds, ...rest } = cohort;
    const membersCount = memberIds.length;

    return {
      ...rest,
      isMember: isMember(cohort, userId),
      isOwner: isOwner(cohort, userId),
      membersCount
    };
  });

const responseWithCohort = (cohort, userId) => {
  const { _id, createdAt, description, isArchived, memberIds, name } = cohort;
  const membersCount = memberIds.length;

  return {
    _id,
    createdAt,
    description,
    isArchived,
    isMember: isMember(cohort, userId),
    isOwner: isOwner(cohort, userId),
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
    locks,
    memberIds: membersCollection,
    name,
    ownerIds
  } = doc;
  const members = _keyBy(
    responseWithCohortMembers(membersCollection, ownerIds),
    '_id'
  );
  const membersCount = membersCollection.length;

  const cohortToReturn = {
    _id,
    createdAt,
    description,
    isArchived,
    isMember: true,
    locks,
    membersCount,
    members,
    name
  };

  if (userId) {
    cohortToReturn.isOwner = checkIfArrayContainsUserId(ownerIds, userId);
  }

  return cohortToReturn;
};

/**
 * isDefined function returns true if value if different
 * from undefined, so 'false' will return true
 * @x {boolean or string or object} x Boolean value
 */
const isDefined = x => x !== undefined;

/**
 * Create object with key/value pairs.
 * If the namespace is missing value is equal to the key
 * In other case it's created by joining namespace with a key.
 * @param {string} namespace - current enums' namespace
 * @param {string} keys - individual enums
 * @return {object} - object of enums
 */
const enumerable = (namespace = null) => (...keys) =>
  Object.freeze(
    fromEntries(
      keys.map(key => [key, namespace ? [namespace, key].join('/') : key])
    )
  );

const mapObject = callback => object =>
  Object.entries(object).reduce(
    (newObject, [key, value]) => ({ ...newObject, [key]: callback(value) }),
    {}
  );

const sanitizeObject = mapObject(sanitize);

const updateProperties = (object, updates) => {
  _forEach(updates, (value, key) => {
    if (object[key]) {
      // eslint-disable-next-line no-param-reassign
      object[key] = value;
    }
  });
};
const runAsyncTasks = async (...tasks) => {
  tasks.forEach(task => task());

  try {
    await Promise.all(tasks);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Migration failed...', err);
    throw err;
  }
};
/* eslint-disable-next-line no-console */
const fireAndForget = promise => promise.catch(err => console.error(err));

const returnPayload = promise => payload => promise.then(() => payload);

const responseWithListDetails = (list, userId) => cohort => {
  const {
    isArchived,
    items: listItems,
    memberIds,
    ownerIds,
    viewersIds: viewersCollection
  } = list;
  const activeItems = listItems.filter(item => !item.isArchived);
  const items = responseWithItems(userId, activeItems);
  const cohortMembers = cohort ? cohort.memberIds : [];

  const members = responseWithListMembers(
    viewersCollection,
    memberIds,
    ownerIds,
    cohortMembers
  );

  return {
    ...responseWithListMetaData(list, userId),
    cohortId: cohort ? cohort.cohortId : null,
    cohortName: cohort ? cohort.name : null,
    isArchived,
    items: _keyBy(items, '_id'),
    members: _keyBy(members, '_id')
  };
};
const getHours = milliseconds => Math.floor(milliseconds / 3600000);

const formatHours = hours => (hours === 1 ? `${hours} hour` : `${hours} hours`);

const getUnhandledItems = items => items.filter(item => !item.done);

const getDoneItems = items => items.filter(item => item.done);

/**
 *
 * @param {items} array of items
 * @param {userId} user id
 * @return {Array} return array of items where passed userId was an author
 */
const getAuthorItems = items => userId =>
  items.filter(item => item.authorId.toString() === userId.toString());

/**
 *
 * @param {items} array of items
 * @param {list} list object
 * @return {array} array of objects
 */
const formatItems = items => list =>
  items.map(item => ({
    listName: list.name,
    listId: list._id,
    ...item
  }));

/**
 *
 * @param {lists} array of objects eg. array of lists
 * @param {namespace} name of object property to merge eg. 'items'
 * @return {Array} new array of merged objects
 */
const prepareItemsByDoneUnhandled = lists => userId => {
  const dataToReturn = {
    unhandled: [],
    done: []
  };

  lists.forEach(list => {
    const { items } = list;
    const authorItems = getAuthorItems(items)(userId);
    const formattedItems = formatItems(authorItems)(list);
    const unhandled = getUnhandledItems(formattedItems);
    const done = getDoneItems(formattedItems);

    dataToReturn.unhandled.push(...unhandled);
    dataToReturn.done.push(...done);
  });

  return dataToReturn;
};

module.exports = {
  checkIfArrayContainsUserId,
  checkIfCohortMember,
  countItems,
  enumerable,
  filter,
  fireAndForget,
  formatHours,
  getAuthorItems,
  getDoneItems,
  getHours,
  getUnhandledItems,
  isDefined,
  isMember,
  isOwner,
  isValidMongoId,
  isViewer,
  prepareItemsByDoneUnhandled,
  responseWithCohort,
  responseWithCohortDetails,
  responseWithCohortMember,
  responseWithCohortMembers,
  responseWithCohorts,
  responseWithComment,
  responseWithComments,
  responseWithItem,
  responseWithItems,
  responseWithListDetails,
  responseWithListMember,
  responseWithListMembers,
  responseWithListMetaData,
  responseWithListsMetaData,
  returnPayload,
  runAsyncTasks,
  sanitizeObject,
  updateProperties,
  updateSubdocumentFields
};
