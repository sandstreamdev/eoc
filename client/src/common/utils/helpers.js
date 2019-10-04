import _orderBy from 'lodash/orderBy';
import _filter from 'lodash/filter';

import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { asyncPostfixes, USER_ANONYMOUS } from 'common/constants/variables';
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

/**
 * Create object with key/value pairs.
 * If the namespace is missing value is equal to the key
 * In other case it's created by joining namespace with a key.
 * @param {string} namespace - current enums' namespace
 * @param {string} keys - individual enums
 * @return {object} - object of enums
 */
export const enumerable = (namespace = null) => (...keys) =>
  Object.freeze(
    fromEntries(
      keys.map(key => [key, namespace ? [namespace, key].join('/') : key])
    )
  );

const filter = f => object =>
  fromEntries(
    Object.entries(object).filter(([key, value]) => f(value, key, object))
  );

export const isDefined = x => x !== undefined;

export const validateWith = validator => errorMessageId => value =>
  validator(value) ? '' : errorMessageId;

export const filterDefined = filter(isDefined);

export const mapObject = callback => object =>
  Object.entries(object).reduce(
    (newObject, [key, value]) => ({ ...newObject, [key]: callback(value) }),
    {}
  );

const isItemDisplayed = (items, limit) => filter => id =>
  _orderBy(_filter(items, filter), item => new Date(item.createdAt).getTime(), [
    'desc'
  ])
    .slice(0, limit)
    .map(item => item._id)
    .includes(id);

export const shouldAnimate = (items, item, listState) => {
  const { _id, done, isArchived } = item;
  const {
    archivedLimit,
    areArchivedItemsDisplayed,
    doneLimit,
    unhandledLimit
  } = listState;

  if (isArchived) {
    if (!areArchivedItemsDisplayed) {
      return false;
    }

    const filter = item => item.isArchived;

    return isItemDisplayed(items, archivedLimit)(filter)(_id);
  }

  if (done) {
    const filter = item => item.done;

    return isItemDisplayed(items, doneLimit)(filter)(_id);
  }

  const filter = item => !item.done;

  return isItemDisplayed(items, unhandledLimit)(filter)(_id);
};

export const channel = (id, route) => `${route}-${id}`;

export const metaDataChannel = (id, route) => `${route}-meta-data-${id}`;

export const formatName = (name, formatMessage) =>
  name || formatMessage({ id: USER_ANONYMOUS });
