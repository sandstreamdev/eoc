import { NOTIFICATION_TIMEOUT } from 'common/constants/variables/';
import history from 'common/utils/history';
import { ValidationException } from 'common/exceptions/ValidationException';
import { UnauthorizedException } from 'common/exceptions/UnauthorizedException';
import { ResourceNotFoundException } from 'common/exceptions/ResourceNotFoundException';

export const ResponseStatusCode = Object.freeze({
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
  UNAUTHORIZED: 401
});

const handleFetchErrors = resp => {
  if (resp.status === ResponseStatusCode.FORBIDDEN) {
    setTimeout(() => {
      window.location = '/';
    }, NOTIFICATION_TIMEOUT);
  }

  if (resp.status === ResponseStatusCode.NOT_FOUND) {
    history.replace('/page-not-found');
    throw new ResourceNotFoundException();
  }

  if (resp.status === ResponseStatusCode.BAD_REQUEST) {
    const contentType = resp.headers.get('content-type');

    if (contentType.includes('application/json')) {
      return resp.json().then(json => {
        throw new Error(json.message || '');
      });
    }

    throw new Error();
  }

  if (resp.status === ResponseStatusCode.UNAUTHORIZED) {
    const contentType = resp.headers.get('content-type');

    if (contentType.includes('application/json')) {
      return resp.json().then(json => {
        throw new UnauthorizedException(json.message || '');
      });
    }

    throw new UnauthorizedException();
  }

  if (resp.status === ResponseStatusCode.NOT_ACCEPTABLE) {
    const contentType = resp.headers.get('content-type');

    if (contentType.includes('application/json')) {
      return resp.json().then(json => {
        throw new ValidationException('', json.errors);
      });
    }

    throw new ValidationException();
  }

  if (resp.status > ResponseStatusCode.BAD_REQUEST && resp.status < 600) {
    throw new Error();
  }

  return resp;
};

export const getData = url =>
  fetch(url, {
    credentials: 'include'
  }).then(handleFetchErrors);

export const postData = (url, data) =>
  fetch(url, {
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }).then(handleFetchErrors);

export const patchData = (url, data) =>
  fetch(url, {
    body: JSON.stringify(data),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH'
  }).then(handleFetchErrors);

export const postRequest = url =>
  fetch(url, {
    credentials: 'include',
    method: 'POST',
    mode: 'no-cors'
  });

export const deleteData = url =>
  fetch(url, {
    credentials: 'include',
    method: 'DELETE'
  }).then(handleFetchErrors);
