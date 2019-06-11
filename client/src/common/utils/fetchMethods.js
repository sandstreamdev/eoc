import { NOTIFICATION_TIMEOUT } from 'common/constants/variables/';
import history from 'common/utils/history';

export const ResponseStatusCode = Object.freeze({
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404
});

const handleFetchErrors = resp => {
  if (resp.status === ResponseStatusCode.FORBIDDEN) {
    setTimeout(() => {
      window.location = '/';
    }, NOTIFICATION_TIMEOUT);
  }

  if (resp.status === ResponseStatusCode.NOT_FOUND) {
    history.replace('/page-not-found');
    throw new Error();
  }

  if (resp.status === ResponseStatusCode.BAD_REQUEST) {
    const contentType = resp.headers.get('content-type');
    if (contentType.includes('application/json')) {
      return resp.json().then(json => {
        if (json.message) {
          throw new Error(json.message);
        }
        throw new Error();
      });
    }

    throw new Error();
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
