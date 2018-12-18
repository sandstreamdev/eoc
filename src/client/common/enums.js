const messageType = Object.freeze({
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success'
});

const statusType = Object.freeze({
  PENDING: 'pending',
  RESOLVED: 'resolved',
  ERROR: 'error'
});

export { messageType, statusType };
