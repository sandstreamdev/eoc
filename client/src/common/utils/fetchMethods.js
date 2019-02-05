export const getData = url =>
  fetch(url, {
    credentials: 'include'
  });

export const postData = (url, data) =>
  fetch(url, {
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

export const patchData = (url, data) =>
  fetch(url, {
    body: JSON.stringify(data),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH'
  });

export const postRequest = url =>
  fetch(url, {
    credentials: 'include',
    method: 'POST',
    mode: 'no-cors'
  });
