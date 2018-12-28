const getItems = state => state.items;
const getFetchStatus = state => state.uiStatus.fetchStatus;
const getNewItemStatus = state => state.uiStatus.newItemStatus;

export { getItems, getFetchStatus, getNewItemStatus };
