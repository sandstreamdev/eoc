import { formatName } from './helpers';
import { USER_ANONYMOUS } from '../constants/variables';

/**
 * This 'fakeFormatMessage' is to simualate formatMessage
 * function from react-intl library, because we don't have
 * access to an instance of this function here.
 */
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
