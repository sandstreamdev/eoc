const { ObjectId } = require('mongoose').Types;

const {
  checkIfArrayContainsUserId,
  checkIfCohortMember,
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
  responseWithListsMetaData
} = require('./index');
const {
  expectedCohortListProperties,
  expectedListMetaDataProperties,
  expectedListProperties,
  listMock
} = require('../../tests/__mocks__/listMock');
const {
  expectedItemProperties,
  itemsMock
} = require('../../tests/__mocks__/itemsMock');
const {
  cohortsMock,
  expectedCohortMetaDataProperties
} = require('../../tests/__mocks__/cohortsMock');
const {
  expectedUsersProperties,
  usersMock
} = require('../../tests/__mocks__/usersMock');
const {
  commentMock,
  commentsMock,
  expectedCommentProperties
} = require('../../tests/__mocks__/commentMock');

describe('function isValidMongoId', () => {
  it('returns true if passed ID is a valid mongo id', () => {
    const id = ObjectId();
    const result = isValidMongoId(id);

    expect(id).toBeInstanceOf(ObjectId);
    expect(result).toBe(true);
  });

  it('returns false if passed ID is an invalid mongo id', () => {
    const id = '1243sb3';
    const result = isValidMongoId(id);

    expect(result).toBe(false);
  });
});

describe('function isUserFavourite', () => {
  it('returns true if user is inside favIds array', () => {
    const favIds = ['123', '456', '789'];
    const userId = '123';

    const result = isUserFavourite(favIds, userId);
    expect(result).toBe(true);
  });

  it('returns true if user is inside favIds array', () => {
    const newId = ObjectId();
    const favIds = ['123', '456', '789'];

    favIds.push(newId);

    const result = isUserFavourite(favIds, newId);
    expect(result).toBe(true);
  });

  it('returns false if user is not inside favIds array', () => {
    const userId = '999';
    const favIds = ['123', '456', '789'];

    const result = isUserFavourite(favIds, userId);
    expect(result).toBe(false);
  });

  it('returns false if user is not inside favIds empty array', () => {
    const userId = '999';
    const favIds = [];

    const result = isUserFavourite(favIds, userId);
    expect(result).toBe(false);
  });
});

describe('function responseWithList', () => {
  const list = listMock[0];
  const userId = ObjectId();

  list.cohortId = ObjectId();

  const result = responseWithList(list, userId);

  it('returns list object with desired properties', () => {
    expectedListProperties.map(property =>
      expect(result).toHaveProperty(property)
    );
  });

  it('returns list object without sensitive data', () => {
    const notExpected = 'favIds';

    expect(result).not.toHaveProperty(notExpected);
  });

  it('returns object with desired properties for cohort list', () => {
    expectedCohortListProperties.map(property =>
      expect(result).toHaveProperty(property)
    );
  });
});

describe('function responseWithListsMetaData', () => {
  const userId = ObjectId();
  const lists = responseWithListsMetaData(listMock, userId);

  it('returns objects with desired meta-data properties', () => {
    lists.map(list =>
      expectedListMetaDataProperties.map(property =>
        expect(list).toHaveProperty(property)
      )
    );
  });

  const notExpected = ['favIds', 'items'];

  it('returns list objects without sensitive data', () => {
    lists.map(list =>
      notExpected.map(property => expect(list).not.toHaveProperty(property))
    );
  });
});

describe('function responseWithItems ', () => {
  const userId = ObjectId();
  const result = responseWithItems(userId, itemsMock);

  it('returns items with desired properties', () => {
    expectedItemProperties.map(property =>
      result.map(item => expect(item).toHaveProperty(property))
    );
  });

  const notExpected = 'voterIds';
  it('returns items without sensitive data', () => {
    result.map(item => expect(item).not.toHaveProperty(notExpected));
  });
});

describe('function responseWithItem', () => {
  const item = itemsMock[0];
  const userId = ObjectId();
  const result = responseWithItem(item, userId);

  it('returns item with desired properties', () => {
    expectedItemProperties.map(property =>
      expect(result).toHaveProperty(property)
    );
  });

  const notExpected = 'voterIds';

  it('returns item without sensitive data', () => {
    expect(result).not.toHaveProperty(notExpected);
  });
});

describe('function responseWithCohorts', () => {
  const result = responseWithCohorts(cohortsMock);

  it('returns cohorts meta data with desired properties', () => {
    expectedCohortMetaDataProperties.map(property =>
      result.map(cohort => expect(cohort).toHaveProperty(property))
    );
  });

  const notExpected = ['favIds', 'ownerIds', 'memberIds'];

  it('returns cohorts meta data without sensitive data', () => {
    notExpected.map(property =>
      result.map(cohort => expect(cohort).not.toHaveProperty(property))
    );
  });
});

describe('function responseWithCohort', () => {
  const cohort = cohortsMock[0];
  const result = responseWithCohort(cohort);

  it('returns cohort data with desired properties', () => {
    expectedCohortMetaDataProperties.map(property =>
      expect(result).toHaveProperty(property)
    );
  });

  const notExpected = ['favIds', 'ownerIds', 'memberIds'];

  it('returns cohort data without sensitive data', () => {
    notExpected.map(property => expect(result).not.toHaveProperty(property));
  });
});

describe('function checkIfArrayContainsUserId', () => {
  const idsArray = ['123', '456', '789'];

  it('returns true if the passed array does contains the userID', () => {
    const userId = '123';
    const result = checkIfArrayContainsUserId(idsArray, userId);

    expect(result).toBe(true);
  });

  it('returns false if the passed array does not contain the user id as string', () => {
    const userId = '999';
    const result = checkIfArrayContainsUserId(idsArray, userId);

    expect(result).toBe(false);
  });

  it('returns false if the passed array does not contain the user id as ObjectId', () => {
    const userId = ObjectId();
    const idsArray = [ObjectId(), ObjectId(), ObjectId()];
    const result = checkIfArrayContainsUserId(idsArray, userId);

    expect(result).toBe(false);
  });
});

describe('function responseWithCohortMembers', () => {
  const ownerIds = ['123', '456', '789'];
  const members = responseWithCohortMembers(usersMock, ownerIds);

  it('returns objects with desired properties', () => {
    expectedUsersProperties.map(property =>
      members.map(member => expect(member).toHaveProperty(property))
    );
  });

  it('returns object without sensitive data', () => {
    const notExpectedUserProperties = ['email'];

    notExpectedUserProperties.map(property =>
      members.map(member => expect(member).not.toHaveProperty(property))
    );
  });
});

describe('function checkIfCohortMember', () => {
  const cohort = cohortsMock[0];

  it('returns false if passed user id is not a cohort member', () => {
    const userId = ObjectId();
    const result = checkIfCohortMember(cohort, userId);

    expect(result).toBe(false);
  });

  it('returns false if passed user id as string is not a cohort member', () => {
    const userId = 'dsad134sa';
    const result = checkIfCohortMember(cohort, userId);

    expect(result).toBe(false);
  });

  it('returns true if passed user id as ObjectId is a cohort member', () => {
    const userId = ObjectId();
    cohort.memberIds.push(userId);

    const result = checkIfCohortMember(cohort, userId);

    expect(result).toBe(true);
  });
});

describe('function responseWithCohortMember', () => {
  const user = usersMock[0];
  const ownerIds = ['123', '456', '789'];

  const result = responseWithCohortMember(user, ownerIds);

  it('returns user object with desired properties', () => {
    expectedUsersProperties.map(property =>
      expect(result).toHaveProperty(property)
    );
  });

  it('returns object without sensitive data', () => {
    const notExpected = 'email';

    expect(result).not.toHaveProperty(notExpected);
  });
});

describe('function responseWithListMember', () => {
  const cohortMembersIds = ['123', '456', '789'];
  const user = usersMock[0];
  const result = responseWithListMember(user, cohortMembersIds);

  it('returns object with desired properties', () => {
    expectedUsersProperties.map(property =>
      expect(result).toHaveProperty(property)
    );
  });

  it('returns object without sensitive data', () => {
    const notExpected = 'email';

    expect(result).not.toHaveProperty(notExpected);
  });
});

describe('function responseWithListMembers', () => {
  const viewers = usersMock;
  const memberIds = ['123', '234'];
  const ownerIds = ['345', '456'];
  const cohortMembersIds = ['567', '678'];

  const result = responseWithListMembers(
    viewers,
    memberIds,
    ownerIds,
    cohortMembersIds
  );

  it('returns objects with desired properties', () => {
    expectedUsersProperties.map(property =>
      result.map(user => expect(user).toHaveProperty(property))
    );
  });

  it('returns objects without sensitive data', () => {
    const notExpected = 'email';

    result.map(user => expect(user).not.toHaveProperty(notExpected));
  });
});

describe('function responseWithComments ', () => {
  const result = responseWithComments(commentsMock);

  it('returns comments with desired properties', () => {
    expectedCommentProperties.map(property =>
      result.map(comment => expect(comment).toHaveProperty(property))
    );
  });
});

describe('function responseWithComment', () => {
  const comment = commentMock;
  const { avatarUrl, displayName } = usersMock[0];

  const result = responseWithComment(comment, avatarUrl, displayName);

  it('returns comment with desired properties', () => {
    expectedCommentProperties.map(property =>
      expect(result).toHaveProperty(property)
    );
  });
});
