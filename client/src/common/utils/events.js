export const attachBeforeUnloadEvent = callback =>
  window.addEventListener('beforeunload', callback);

export const removeBeforeUnloadEvent = callback =>
  window.removeEventListener('beforeunload', callback);
