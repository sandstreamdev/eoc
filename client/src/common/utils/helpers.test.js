import { formatName } from './helpers';
import { USER_ANONYMOUS } from '../constants/variables';

const fakeFormatMessage = () => USER_ANONYMOUS;

describe('formatName', () => {
  it('should return name if name is defined', () => {
    const name = 'John Doe';

    expect(formatName(name, fakeFormatMessage)).toEqual(name);
  });

  it('should return Anonymous if name is undefined', () => {
    expect(formatName(undefined, fakeFormatMessage)).toEqual(USER_ANONYMOUS);
  });

  it('should return Anonymous if name is null', () => {
    expect(formatName(null, fakeFormatMessage)).toEqual(USER_ANONYMOUS);
  });

  it('should return Anonymous if name is an empty string', () => {
    expect(formatName('', fakeFormatMessage)).toEqual(USER_ANONYMOUS);
  });
});
