export const getData = url =>
  fetch(url, {
    credentials: 'include'
  });

export const postData = (url, data) =>
  fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    credentials: 'include'
  });

export const patchData = (url, data) =>
  fetch(url, {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH',
    credentials: 'include'
  });

export const postRequest = url =>
  fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'include'
  });
