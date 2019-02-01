export const getData = url =>
  fetch(url, {
    credentials: 'same-origin'
  });

export const postData = (url, data) =>
  fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

export const patchData = (url, data) =>
  fetch(url, {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH'
  });

export const postRequest = url =>
  fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'include'
  });
