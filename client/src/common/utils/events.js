export const attachBeforeUnloadEvent = callback =>
  window.addEventListener('beforeunload', callback);

export const removeBeforeUnloadEvent = callback =>
  window.removeEventListener('beforeunload', callback);

export const handleWindowBeforeUnload = event => {
  event.preventDefault();
  // Chrome requires returnValue to be set
  // eslint-disable-next-line no-param-reassign
  event.returnValue = '';
};
