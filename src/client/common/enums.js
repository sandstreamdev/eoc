const MessageType = Object.freeze({
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success'
});

const StatusType = Object.freeze({
  PENDING: 'pending',
  RESOLVED: 'resolved',
  ERROR: 'error'
});

export { MessageType, StatusType };
