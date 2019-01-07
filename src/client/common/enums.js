const ListType = Object.freeze({
  ARCHIVED: true,
  SHOPPING: false
});

const MessageType = Object.freeze({
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success'
});

const SortType = Object.freeze({
  ASCENDING: 'ascending',
  DESCENDING: 'descending'
});

const StatusType = Object.freeze({
  PENDING: 'pending',
  RESOLVED: 'resolved',
  ERROR: 'error'
});

export { ListType, MessageType, SortType, StatusType };
