import { capitalizeString } from 'common/utils/helpers';

describe('function capitalizeString ', () => {
  it('should return a string with a first capitalized letter', () => {
    let firstLetter;

    firstLetter = capitalizeString('test').charAt(0);
    expect(firstLetter === firstLetter.toUpperCase()).toBe(true);

    firstLetter = capitalizeString('device').charAt(0);
    expect(firstLetter === firstLetter.toUpperCase()).toBe(true);

    firstLetter = capitalizeString('/&^&@42)').charAt(0);
    expect(firstLetter === firstLetter.toUpperCase()).toBe(true);
  });

  it('should return false as the first letter is not capitalized', () => {
    const firstLetter = 'test'.charAt(0);

    expect(firstLetter === firstLetter.toUpperCase()).toBe(false);
  });
});
