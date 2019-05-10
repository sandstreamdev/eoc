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
  const { _id, cohortId, description, favIds, items, name, type } = list;
  const doneItemsCount = items.filter(item => item.isOrdered).length;
  const unhandledItemsCount = items.length - doneItemsCount;

  const listToSend = {
    _id,
    description,
    doneItemsCount,
    isFavourite: isUserFavourite(favIds, userId),
    name,
    type,
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
    const { voterIds, ...rest } = item;

    return {
      ...rest,
      isVoted: checkIfCurrentUserVoted(item, userId),
      votesCount: voterIds.length
    };
  });
};

const responseWithItem = (item, userId) => {
  const { voterIds, ...rest } = item;

  return {
    ...rest,
    isVoted: checkIfCurrentUserVoted(item, userId),
    votesCount: voterIds.length
  };
};

const responseWithCohorts = (cohorts, userId) =>
  _map(cohorts, ({ _doc }) => {
    const { favIds, memberIds, ownerIds, ...rest } = _doc;
    const membersCount = memberIds.length;

    return {
      ...rest,
      isFavourite: isUserFavourite(favIds, userId),
      membersCount
    };
  });

const responseWithCohort = (cohort, userId) => {
  const { _id, description, favIds, memberIds, name } = cohort;
  const membersCount = memberIds.length;

  return {
    _id,
    description,
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
  viewers.map(user => {
    const { _id } = user;

    return {
      ...user,
      isOwner: checkIfArrayContainsUserId(ownerIds, _id),
      isGuest: checkIfGuest(cohortMembersIds, _id),
      isMember: checkIfArrayContainsUserId(memberIds, _id)
    };
  });

const responseWithComment = (comment, avatarUrl, displayName) => {
  const { _id, authorId, createdAt, text } = comment.toObject();

  return {
    _id,
    authorAvatarUrl: avatarUrl,
    authorId,
    authorName: displayName,
    createdAt,
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
  checkIfGuest,
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
  responseWithLists
};
