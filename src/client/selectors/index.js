const getCurrentUser = state => state.currentUser;
const getNewItemStatus = state => state.uiStatus.newItemStatus;
const getFetchStatus = state => state.uiStatus.fetchStatus;
const getItems = state => state.items;

export { getCurrentUser, getFetchStatus, getNewItemStatus, getItems };
