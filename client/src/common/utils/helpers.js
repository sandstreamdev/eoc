import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { asyncPostfixes } from 'common/constants/variables';
import { Routes } from 'common/constants/enums';

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

export const routeGenerator = (route, param = null) =>
  `/${route}${param ? `/${param}` : ''}`;

export const cohortRoute = id => routeGenerator(Routes.COHORT, id);

export const cohortsRoute = () => routeGenerator(Routes.COHORTS);

export const dashboardRoute = () => routeGenerator(Routes.DASHBOARD);

export const enumerable = namespace => (...keys) =>
  Object.freeze(
    Object.fromEntries(keys.map(key => [key, [namespace, key].join('/')]))
  );

export const asyncTypes = key =>
  asyncPostfixes.map(postfix => [key, postfix].join('_'));
