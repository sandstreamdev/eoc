import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { asyncPostfixes } from 'common/constants/variables';
import { Routes, PasswordValidationValues } from 'common/constants/enums';

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

export const validatePassword = value =>
  value.match(
    new RegExp(
      `^[^\\s]{${PasswordValidationValues.MIN},${
        PasswordValidationValues.MAX
      }}$`
    )
  );

export const routeGenerator = (route, param = null) =>
  `/${route}${param ? `/${param}` : ''}`;

export const cohortRoute = id => routeGenerator(Routes.COHORT, id);

export const cohortsRoute = () => routeGenerator(Routes.COHORTS);

export const dashboardRoute = () => routeGenerator(Routes.DASHBOARD);

const fromEntries = convertedArray =>
  convertedArray.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

export const asyncTypes = key =>
  asyncPostfixes.map(postfix => [key, postfix].join('_'));

export const enumerable = namespace => (...keys) =>
  Object.freeze(
    fromEntries(keys.map(key => [key, [namespace, key].join('/')]))
  );

const filter = f => object =>
  fromEntries(
    Object.entries(object).filter(([key, value]) => f(value, key, object))
  );

export const isDefined = x => x !== undefined;

export const validateWith = validator => errorMessageId => value =>
  validator(value) ? '' : errorMessageId;

export const filterDefined = filter(isDefined);
