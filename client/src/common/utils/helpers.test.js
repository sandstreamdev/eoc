import { isUrlValid } from './helpers';

describe('function isUrlValid', () => {
  it('should return true in every case', () => {
    expect(isUrlValid('www.test.pl')).toBe(true);
    expect(isUrlValid('http://test.pl')).toBe(true);
    expect(isUrlValid('https://test.pl')).toBe(true);
    expect(isUrlValid('https://www.test.pl')).toBe(true);
    expect(isUrlValid('www.test.pl')).toBe(true);
    expect(isUrlValid('www.test.pl')).toBe(true);
    expect(isUrlValid('http://www.test.pl')).toBe(true);
  });

  it('should return false in every case', () => {
    expect(isUrlValid('test')).toBe(false);
    expect(isUrlValid('*.com')).toBe(false);
    expect(isUrlValid('www.*#$!#@.pl')).toBe(false);
    expect(isUrlValid('wwwtest..pl')).toBe(false);
  });
});
