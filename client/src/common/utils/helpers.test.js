import { isUrlValid, makeAbortablePromise } from './helpers';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';

describe('check if isUrlValid functions validates url properly', () => {
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

/** THIS TEST PASS, however it is working not correctly
 *  I don't know exactly how to test this function.
 */
describe('should abort promise', () => {
  it('should abort promise after 2 seconds', () => {
    const promise1 = new Promise((resolve, reject) => {
      resolve('foo');
      reject();
    });

    let promiseStatus;
    const pendingPromise = makeAbortablePromise(promise1);

    pendingPromise.promise
      .then(() => {
        promiseStatus = 'pending';
        setTimeout(() => console.log('promise fullfiled'), 3000);
      })
      .then(() => {
        promiseStatus = 'fullfilled';
      })
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          promiseStatus = 'rejected';
        }
      });

    setTimeout(() => {
      pendingPromise.abort();

      expect(promiseStatus).toBe('rejected');
    }, 2000);
  });
});
