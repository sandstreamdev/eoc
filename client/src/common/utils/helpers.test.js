import { formatUserName } from './helpers';
import { USER_ANONYMOUS } from '../constants/variables';

const fakeFormatMessage = () => USER_ANONYMOUS;

describe('formatUserName', () => {
  it('should return name if name is defined', () => {
    const name = 'John Doe';

    expect(formatUserName(name, fakeFormatMessage)).toEqual(name);
  });

  it('should return Anonymous if name is undefined', () => {
    expect(formatUserName(undefined, fakeFormatMessage)).toEqual(
      USER_ANONYMOUS
    );
  });

  it('should return Anonymous if name is null', () => {
    expect(formatUserName(null, fakeFormatMessage)).toEqual(USER_ANONYMOUS);
  });

  it('should return Anonymous if name is an empty string', () => {
    expect(formatUserName('', fakeFormatMessage)).toEqual(USER_ANONYMOUS);
  });
});
