const getCurrentUser = state => state.currentUser;
const getItems = state => state.items;
const getFetchStatus = state => state.uiStatus.fetchStatus;
const getNewItemStatus = state => state.uiStatus.newItemStatus;

export { getCurrentUser, getItems, getFetchStatus, getNewItemStatus };
