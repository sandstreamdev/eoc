import {
  FRONTEND_URL,
  NOTIFICATION_TIMEOUT
} from 'common/constants/variables/';
import history from 'common/utils/history';

const handleFetchErrors = resp => {
  if (resp.status === 403) {
    setTimeout(() => {
      window.location = FRONTEND_URL;
    }, NOTIFICATION_TIMEOUT);
  }

  if (resp.status === 404) {
    history.push('/page-not-found');
  }

  if (resp.status >= 400 && resp.status < 600) {
    return resp.json().then(json => {
      throw new Error(json.message);
    });
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
