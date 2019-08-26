import { NOTIFICATION_TIMEOUT } from 'common/constants/variables/';
import history from 'common/utils/history';
import {
  ForbiddenException,
  ResourceNotFoundException,
  UnauthorizedException,
  ValidationException
} from 'common/exceptions';

export const ResponseStatusCode = Object.freeze({
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
  UNAUTHORIZED: 401
});

const handleFetchErrors = response => {
  if (response.status === ResponseStatusCode.FORBIDDEN) {
    setTimeout(() => {
      window.location = '/';
    }, NOTIFICATION_TIMEOUT);
    throw new ForbiddenException();
  }

  if (response.status === ResponseStatusCode.NOT_FOUND) {
    history.replace('/page-not-found');
    throw new ResourceNotFoundException();
  }

  if (response.status === ResponseStatusCode.BAD_REQUEST) {
    const contentType = response.headers.get('content-type');

    if (contentType.includes('application/json')) {
      return response.json().then(json => {
        throw new Error(json.message || '');
      });
    }

    throw new Error();
  }

  if (response.status === ResponseStatusCode.UNAUTHORIZED) {
    const contentType = response.headers.get('content-type');

    if (contentType.includes('application/json')) {
      return response.json().then(json => {
        throw new UnauthorizedException(json.message || '');
      });
    }

    throw new UnauthorizedException();
  }

  if (response.status === ResponseStatusCode.NOT_ACCEPTABLE) {
    const contentType = response.headers.get('content-type');

    if (contentType.includes('application/json')) {
      return response.json().then(json => {
        throw new ValidationException('', json.errors);
      });
    }

    throw new ValidationException();
  }

  if (
    response.status > ResponseStatusCode.BAD_REQUEST &&
    response.status < 600
  ) {
    throw new Error();
  }

  return response;
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

export const getJson = url => getData(url).then(response => response.json());
