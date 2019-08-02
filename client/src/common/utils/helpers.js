import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';

export const makeAbortablePromise = promise => {
  let _reject;

  const wrappedPromise = new Promise((resolve, reject) => {
    _reject = reject;
    promise.then(val => resolve(val), error => reject(error));
  });

  return {
    promise: wrappedPromise,
    abort() {
      _reject(new AbortPromiseException());
    }
  };
};

export const dateFromString = string => new Date(string).toLocaleString();

export const validatePassword = value => value.match(/^[^\s]{4,32}$/);
