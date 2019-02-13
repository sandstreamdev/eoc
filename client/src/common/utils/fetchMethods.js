const handleFetchErrors = resp => {
  if (resp.status === 403) {
    setTimeout(() => {
      window.location = '/';
    }, 5000);
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
