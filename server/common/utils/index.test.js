const { ObjectId } = require('mongoose').Types;

const {
  checkIfArrayContainsUserId,
  checkIfCurrentUserVoted,
  checkIfGuest,
  isUserFavourite,
  isValidMongoId,
  responseWithCohort,
  responseWithCohortMembers,
  responseWithCohorts,
  responseWithItem,
  responseWithItems,
  responseWithList,
  responseWithLists
} = require('./index');
const {
  expectedCohortListProperties,
  expectedListMetaDataProperties,
  expectedListProperties,
  listMock
} = require('../../tests/__mocks__/listMock');
const { expectedItemProperties } = require('../../tests/__mocks__/itemsMock');
const { singleItemMock } = require('../../tests/__mocks__/singleItemMock');
const {
  cohortsMock,
  expectedCohortMetaDataProperties
} = require('../../tests/__mocks__/cohortsMock');
const {
  expectedUsersProperties,
  usersMock
} = require('../../tests/__mocks__/usersMock');

describe('testing __isValidMongoId__ function', () => {
  it('should return true', () => {
    const id = ObjectId();
    const result = isValidMongoId(id);

    expect(id).toBeInstanceOf(ObjectId);
    expect(result).toBe(true);
  });

  it('should return false', () => {
    const id = '1243sb3';
    const result = isValidMongoId(id);

    expect(result).toBe(false);
  });
});

describe('testing __isUserFavourite__ function', () => {
  it('should be true', () => {
    const favIds = ['123', '456', '789'];
    const userId = '123';

    const result = isUserFavourite(favIds, userId);
    expect(result).toBe(true);
  });

  it('should be true', () => {
    const newId = ObjectId();
    const favIds = ['123', '456', '789'];

    favIds.push(newId);

    const result = isUserFavourite(favIds, newId);
    expect(result).toBe(true);
  });

  it('should be false', () => {
    const userId = '999';
    const favIds = ['123', '456', '789'];

    const result = isUserFavourite(favIds, userId);
    expect(result).toBe(false);
  });

  it('should be false', () => {
    const userId = '999';
    const favIds = [];

    const result = isUserFavourite(favIds, userId);
    expect(result).toBe(false);
  });
});

describe('testing __responseWithList__ function', () => {
  const list = listMock[0];
  const userId = ObjectId();

  list.cohortId = ObjectId();

  const result = responseWithList(list, userId);

  it('should return object with desired properties', () => {
    expectedListProperties.map(property =>
      expect(result).toHaveProperty(property)
    );
  });

  it('should return object without favIds property', () => {
    const notExpected = 'favIds';

    expect(result).not.toHaveProperty(notExpected);
  });

  it('should return object with desired properties for cohort list', () => {
    expectedCohortListProperties.map(property =>
      expect(result).toHaveProperty(property)
    );
  });
});

describe('testing __responseWithLists__ function', () => {
  const userId = ObjectId();
  const lists = responseWithLists(listMock, userId);

  it('expect to have only desired meta-data properties without sensitive data', () => {
    lists.map(list =>
      expectedListMetaDataProperties.map(property =>
        expect(list).toHaveProperty(property)
      )
    );
  });

  const notExpected = ['favIds', 'items'];

  it('returned object should not have items and favIds properties', () => {
    lists.map(list =>
      notExpected.map(property => expect(list).not.toHaveProperty(property))
    );
  });
});

describe('testing __checkIfCurrentUserVoted__ function', () => {
  it('should be true', () => {
    const userId = '123';
    const item = {
      voterIds: ['123', '345', '678']
    };
    const result = checkIfCurrentUserVoted(item, userId);

    expect(result).toBe(true);
  });

  it('should be true', () => {
    const userId = ObjectId();
    const item = { voterIds: ['123', '345', '678'] };
    item.voterIds.push(userId);

    const result = checkIfCurrentUserVoted(item, userId);

    expect(result).toBe(true);
  });

  it('should be false', () => {
    const userId = ObjectId();
    const item = { voterIds: ['123', '345', '678'] };
    const result = checkIfCurrentUserVoted(item, userId);

    expect(result).toBe(false);
  });
});

describe('testing __responseWithItems__ function ', () => {
  const userId = ObjectId();
  const result = responseWithItems(userId, listMock[0]);

  it('should return items with desired properties', () => {
    expectedItemProperties.map(property =>
      result.map(item => expect(item).toHaveProperty(property))
    );
  });

  const notExpected = 'voterIds';
  it('should return items without voterIds property', () => {
    result.map(item => expect(item).not.toHaveProperty(notExpected));
  });
});

describe('testing __responseWithItem__function ', () => {
  const item = singleItemMock[0];
  const userId = ObjectId();
  const result = responseWithItem(item, userId);

  it('should return single item with desired properties', () => {
    expectedItemProperties.map(property =>
      expect(result).toHaveProperty(property)
    );
  });

  const notExpected = 'voterIds';

  it('should return single item without voterIds property', () => {
    expect(result).not.toHaveProperty(notExpected);
  });
});

describe('testing __responseWithCohorts__ function', () => {
  const userId = ObjectId();
  const result = responseWithCohorts(cohortsMock, userId);

  it('should return cohorts meta data with desired properties', () => {
    expectedCohortMetaDataProperties.map(property =>
      result.map(cohort => expect(cohort).toHaveProperty(property))
    );
  });

  const notExpected = ['favIds', 'ownerIds', 'memberIds'];

  it('should return cohorts meta data without favIds, ownerIds, memberIds properties', () => {
    notExpected.map(property =>
      result.map(cohort => expect(cohort).not.toHaveProperty(property))
    );
  });
});

describe('testing __responseWithCohort___ function', () => {
  const userId = ObjectId();
  const cohort = cohortsMock[0];
  const result = responseWithCohort(cohort, userId);

  it('should return cohort data with desired properties', () => {
    expectedCohortMetaDataProperties.map(property =>
      expect(result).toHaveProperty(property)
    );
  });

  const notExpected = ['favIds', 'ownerIds', 'memberIds'];

  it('should return cohort data without favIds, memberIds, ownerIds', () => {
    notExpected.map(property => expect(result).not.toHaveProperty(property));
  });
});

describe('testing __checkIfArrayContainsUserId__', () => {
  const idsArray = ['123', '456', '789'];

  it('should be true', () => {
    const userId = '123';
    const result = checkIfArrayContainsUserId(idsArray, userId);

    expect(result).toBe(true);
  });

  it('should be false', () => {
    const userId = '999';
    const result = checkIfArrayContainsUserId(idsArray, userId);

    expect(result).toBe(false);
  });

  it('should be false', () => {
    const userId = ObjectId();
    const idsArray = [ObjectId(), ObjectId(), ObjectId()];
    const result = checkIfArrayContainsUserId(idsArray, userId);

    expect(result).toBe(false);
  });
});

describe('testing __checkIfGuest__ function', () => {
  const memberIds = ['123', '456', '789'];

  it('should return false', () => {
    const userId = ObjectId();
    const result = checkIfGuest(memberIds, userId);

    expect(result).toBe(true);
  });

  it('should return true', () => {
    const userId = '123';
    const result = checkIfGuest(memberIds, userId);

    expect(result).toBe(false);
  });
});

describe('testing __responseWithCohortMembers__ function', () => {
  const ownerIds = ['123', '456', '789'];
  const members = responseWithCohortMembers(usersMock, ownerIds);

  it('shoudl return objects with desired properties', () => {
    expectedUsersProperties.map(property =>
      members.map(member => expect(member).toHaveProperty(property))
    );
  });

  it('should return user objects without sensitive data like _id and email', () => {
    const notExpectedUserProperties = ['_id', 'email'];

    notExpectedUserProperties.map(property =>
      members.map(member => expect(member).not.toHaveProperty(property))
    );
  });
});
