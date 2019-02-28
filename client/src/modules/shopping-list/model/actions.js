import _keyBy from 'lodash/keyBy';

import { ENDPOINT_URL } from 'common/constants/variables';
import {
  deleteData,
  getData,
  patchData,
  postData
} from 'common/utils/fetchMethods';
import { ShoppingListActionTypes } from './actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import history from 'common/utils/history';

const fetchListDataFailure = errMessage => ({
  type: ShoppingListActionTypes.FETCH_DATA_FAILURE,
  payload: errMessage
});
const fetchListDataSuccess = (data, listId) => ({
  type: ShoppingListActionTypes.FETCH_DATA_SUCCESS,
  payload: { data, listId }
});

const fetchListDataRequest = () => ({
  type: ShoppingListActionTypes.FETCH_DATA_REQUEST
});

const createListSuccess = data => ({
  type: ShoppingListActionTypes.CREATE_LIST_SUCCESS,
  payload: data
});

const createListFailure = errMessage => ({
  type: ShoppingListActionTypes.CREATE_LIST_FAILURE,
  payload: errMessage
});

const createListRequest = () => ({
  type: ShoppingListActionTypes.CREATE_LIST_REQUEST
});

const deleteListSuccess = id => ({
  type: ShoppingListActionTypes.DELETE_SUCCESS,
  payload: id
});

const deleteListFailure = errMessage => ({
  type: ShoppingListActionTypes.DELETE_FAILURE,
  payload: errMessage
});

const deleteListRequest = () => ({
  type: ShoppingListActionTypes.DELETE_REQUEST
});

const updateListSuccess = data => ({
  type: ShoppingListActionTypes.UPDATE_SUCCESS,
  payload: data
});

const updateListFailure = errMessage => ({
  type: ShoppingListActionTypes.UPDATE_FAILURE,
  payload: errMessage
});

const updateListRequest = () => ({
  type: ShoppingListActionTypes.UPDATE_REQUEST
});

const fetchListsMetaDataSuccess = data => ({
  type: ShoppingListActionTypes.FETCH_META_DATA_SUCCESS,
  payload: data
});
const fetchListsMetaDataFailure = errMessage => ({
  type: ShoppingListActionTypes.FETCH_META_DATA_FAILURE,
  payload: errMessage
});
const fetchListsMetaDataRequest = () => ({
  type: ShoppingListActionTypes.FETCH_META_DATA_REQUEST
});

const fetchArchivedListMetaDataSuccess = data => ({
  type: ShoppingListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS,
  payload: data
});
const fetchArchivedListsMetaDataFailure = errMessage => ({
  type: ShoppingListActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE,
  payload: errMessage
});
const fetchArchivedListsMetaDataRequest = () => ({
  type: ShoppingListActionTypes.FETCH_ARCHIVED_META_DATA_REQUEST
});

const archiveListSuccess = data => ({
  type: ShoppingListActionTypes.ARCHIVE_SUCCESS,
  payload: data
});
const archiveListFailure = errMessage => ({
  type: ShoppingListActionTypes.ARCHIVE_FAILURE,
  payload: errMessage
});
const archiveListRequest = () => ({
  type: ShoppingListActionTypes.ARCHIVE_REQUEST
});

const restoreListSuccess = (data, listId) => ({
  type: ShoppingListActionTypes.RESTORE_SUCCESS,
  payload: { data, listId }
});
const restoreListFailure = errMessage => ({
  type: ShoppingListActionTypes.RESTORE_FAILURE,
  payload: errMessage
});
const restoreListRequest = () => ({
  type: ShoppingListActionTypes.RESTORE_REQUEST
});

export const fetchListData = listId => dispatch => {
  dispatch(fetchListDataRequest());
  return getData(`${ENDPOINT_URL}/shopping-lists/${listId}/data`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchListDataSuccess(json, listId)))
    .catch(err => {
      dispatch(fetchListDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching data failed..."
      );
    });
};

export const createList = (
  name,
  description,
  adminId,
  cohortId
) => dispatch => {
  dispatch(createListRequest());
  return postData(`${ENDPOINT_URL}/shopping-lists/create`, {
    adminId,
    cohortId,
    description,
    name
  })
    .then(resp => resp.json())
    .then(json => dispatch(createListSuccess(json)))
    .catch(err => {
      dispatch(createListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, creating new list failed..."
      );
    });
};

export const fetchListsMetaData = () => dispatch => {
  dispatch(fetchListsMetaDataRequest());
  return getData(`${ENDPOINT_URL}/shopping-lists/meta-data`)
    .then(resp => resp.json())
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchListsMetaDataSuccess(dataMap));
    })
    .catch(err => {
      dispatch(fetchListsMetaDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching lists failed..."
      );
    });
};

export const fetchListMetaData = cohortId => dispatch => {
  dispatch(fetchListsMetaDataRequest());
  getData(`${ENDPOINT_URL}/shopping-lists/meta-data/${cohortId}`)
    .then(resp => resp.json())
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchListsMetaDataSuccess(dataMap));
    })
    .catch(err => {
      dispatch(fetchListsMetaDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching lists failed..."
      );
    });
};

export const fetchArchivedListsMetaData = () => dispatch => {
  dispatch(fetchArchivedListsMetaDataRequest());
  return getData(`${ENDPOINT_URL}/shopping-lists/archived`)
    .then(resp => resp.json())
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchArchivedListMetaDataSuccess(dataMap));
    })
    .catch(err => {
      dispatch(fetchArchivedListsMetaDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching lists failed..."
      );
    });
};

export const deleteList = id => dispatch => {
  dispatch(deleteListRequest());
  return deleteData(`${ENDPOINT_URL}/shopping-lists/${id}/delete`)
    .then(resp =>
      resp.json().then(json => {
        dispatch(deleteListSuccess(id));
        createNotificationWithTimeout(
          dispatch,
          NotificationType.SUCCESS,
          json.message
        );
        history.push('/dashboard');
      })
    )
    .catch(err => {
      dispatch(deleteListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, deleting list failed..."
      );
      throw new Error();
    });
};

export const updateList = (listId, data) => dispatch => {
  dispatch(updateListRequest());
  return patchData(`${ENDPOINT_URL}/shopping-lists/${listId}/update`, data)
    .then(resp => resp.json())
    .then(json => {
      dispatch(updateListSuccess({ ...data, listId }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(updateListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, updating list failed..."
      );
    });
};

export const archiveList = listId => dispatch => {
  dispatch(archiveListRequest());
  return patchData(`${ENDPOINT_URL}/shopping-lists/${listId}/update`, {
    isArchived: true
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(archiveListSuccess({ isArchived: true, listId }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        'List was successfully archived!' || json.message
      );
    })
    .catch(err => {
      dispatch(archiveListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, archiving list failed..."
      );
    });
};

export const restoreList = listId => dispatch => {
  dispatch(restoreListRequest());
  return patchData(`${ENDPOINT_URL}/shopping-lists/${listId}/update`, {
    isArchived: false
  })
    .then(() => getData(`${ENDPOINT_URL}/shopping-lists/${listId}/data`))
    .then(resp => resp.json())
    .then(json => {
      dispatch(restoreListSuccess(json, listId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        'List was successfully restored!' || json.message
      );
    })
    .catch(err => {
      dispatch(restoreListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, restoring list failed..."
      );
    });
};
