export const MessageType = Object.freeze({
  ERROR: 'error',
  ERROR_2: 'error_2',
  INFO: 'info',
  SUCCESS: 'success'
});

export const SortOrderType = Object.freeze({
  ASCENDING: 'ascending',
  DESCENDING: 'descending'
});

export const StatusType = Object.freeze({
  PENDING: 'pending',
  RESOLVED: 'resolved',
  ERROR: 'error'
});

export const Routes = Object.freeze({
  COHORT: 'cohort',
  COHORTS: 'cohorts',
  DASHBOARD: 'dashboard',
  LIST: 'sack'
});

export const UserRoles = Object.freeze({
  MEMBER: 'userRoles/MEMBER',
  OWNER: 'userRoles/OWNER',
  VIEWER: 'userRoles/VIEWER'
});

export const UserRolesToDisplay = Object.freeze({
  MEMBER: 'member',
  OWNER: 'owner',
  VIEWER: 'viewer'
});

export const ColorType = {
  BROWN: 'element/BROWN',
  GRAY: 'element/GRAY',
  ORANGE: 'element/ORANGE'
};

export const ViewType = {
  LIST: 'viewType/LIST',
  TILES: 'viewType/TILES'
};

export const KeyCodes = Object.freeze({
  ENTER: 'Enter',
  ESCAPE: 'Escape'
});
