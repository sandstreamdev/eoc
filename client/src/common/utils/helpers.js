import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';

export const isUrlValid = string => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return pattern.test(string);
};

export const makeAbortablePromise = promise => {
  let cancel;

  const wrappedPromise = new Promise((resolve, reject) => {
    cancel = reject;
    promise.then(val => resolve(val), error => reject(error));
  });

  return {
    promise: wrappedPromise,
    abort() {
      cancel(new AbortPromiseException());
    }
  };
};
