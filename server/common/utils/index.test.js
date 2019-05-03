const { ObjectId } = require('mongoose').Types;

const {
  isValidMongoId,
  isUserFavourite,
  checkIfCurrentUserVoted
} = require('./index');

it('validates correct mongoId', () => {
  const id = ObjectId();
  const result = isValidMongoId(id);

  expect(id).toBeInstanceOf(ObjectId);
  expect(result).toBe(true);
});

describe('check if favIds array contains userId', () => {
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

describe('should return true if current user id is in voterIds array', () => {
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
});
