import _keyBy from 'lodash/keyBy';

import { ENDPOINT_URL } from 'common/constants/variables';
import {
  deleteData,
  getData,
  patchData,
  postData
} from 'common/utils/fetchMethods';
import { ListActionTypes } from './actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import history from 'common/utils/history';
import { ItemActionTypes } from '../components/InputBar/model/actionTypes';

const fetchListDataFailure = errMessage => ({
  type: ListActionTypes.FETCH_DATA_FAILURE,
  payload: errMessage
});
const fetchListDataSuccess = (data, listId) => ({
  type: ListActionTypes.FETCH_DATA_SUCCESS,
  payload: { data, listId }
});

const fetchListDataRequest = () => ({
  type: ListActionTypes.FETCH_DATA_REQUEST
});

const createListSuccess = data => ({
  type: ListActionTypes.CREATE_SUCCESS,
  payload: data
});

const createListFailure = errMessage => ({
  type: ListActionTypes.CREATE_FAILURE,
  payload: errMessage
});

const createListRequest = () => ({
  type: ListActionTypes.CREATE_REQUEST
});

const deleteListSuccess = id => ({
  type: ListActionTypes.DELETE_SUCCESS,
  payload: id
});

const deleteListFailure = errMessage => ({
  type: ListActionTypes.DELETE_FAILURE,
  payload: errMessage
});

const deleteListRequest = () => ({
  type: ListActionTypes.DELETE_REQUEST
});

const updateListSuccess = data => ({
  type: ListActionTypes.UPDATE_SUCCESS,
  payload: data
});

const updateListFailure = errMessage => ({
  type: ListActionTypes.UPDATE_FAILURE,
  payload: errMessage
});

const updateListRequest = () => ({
  type: ListActionTypes.UPDATE_REQUEST
});

const fetchListsMetaDataSuccess = data => ({
  type: ListActionTypes.FETCH_META_DATA_SUCCESS,
  payload: data
});
const fetchListsMetaDataFailure = errMessage => ({
  type: ListActionTypes.FETCH_META_DATA_FAILURE,
  payload: errMessage
});
const fetchListsMetaDataRequest = () => ({
  type: ListActionTypes.FETCH_META_DATA_REQUEST
});

const fetchArchivedListsMetaDataSuccess = data => ({
  type: ListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS,
  payload: data
});
const fetchArchivedListsMetaDataFailure = errMessage => ({
  type: ListActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE,
  payload: errMessage
});
const fetchArchivedListsMetaDataRequest = () => ({
  type: ListActionTypes.FETCH_ARCHIVED_META_DATA_REQUEST
});

const archiveListSuccess = data => ({
  type: ListActionTypes.ARCHIVE_SUCCESS,
  payload: data
});
const archiveListFailure = errMessage => ({
  type: ListActionTypes.ARCHIVE_FAILURE,
  payload: errMessage
});
const archiveListRequest = () => ({
  type: ListActionTypes.ARCHIVE_REQUEST
});

const restoreListSuccess = (data, listId) => ({
  type: ListActionTypes.RESTORE_SUCCESS,
  payload: { data, listId }
});
const restoreListFailure = errMessage => ({
  type: ListActionTypes.RESTORE_FAILURE,
  payload: errMessage
});
const restoreListRequest = () => ({
  type: ListActionTypes.RESTORE_REQUEST
});

export const removeArchivedListsMetaData = () => ({
  type: ListActionTypes.REMOVE_ARCHIVED_META_DATA
});

const favouritesRequest = () => ({
  type: ListActionTypes.FAVOURITES_REQUEST
});

const favouritesSuccess = data => ({
  type: ListActionTypes.FAVOURITES_SUCCESS,
  payload: data
});

const favouritesFailure = () => ({
  type: ListActionTypes.FAVOURITES_FAILURE
});

const addViewerRequest = () => ({
  type: ListActionTypes.ADD_VIEWER_REQUEST
});

const addViewerSuccess = (data, listId) => ({
  type: ListActionTypes.ADD_VIEWER_SUCCESS,
  payload: { listId, data }
});

const addViewerFailure = () => ({
  type: ListActionTypes.ADD_VIEWER_FAILURE
});

const removeMemberRequest = () => ({
  type: ListActionTypes.REMOVE_MEMBER_REQUEST
});

const removeMemberFailure = () => ({
  type: ListActionTypes.REMOVE_MEMBER_FAILURE
});

const removeMemberSuccess = (listId, userId) => ({
  type: ListActionTypes.REMOVE_MEMBER_SUCCESS,
  payload: { listId, userId }
});

const updateItemDetailsSuccess = (listId, itemId, data) => ({
  type: ItemActionTypes.UPDATE_DETAILS_SUCCESS,
  payload: { listId, itemId, data }
});

const updateItemDetailsRequest = () => ({
  type: ItemActionTypes.UPDATE_DETAILS_REQUEST
});

const updateItemDetailsFailure = () => ({
  type: ItemActionTypes.UPDATE_DETAILS_FAILURE
});

const addOwnerRoleRequest = () => ({
  type: ListActionTypes.ADD_OWNER_ROLE_REQUEST
});

const addOwnerRoleSuccess = (listId, userId) => ({
  type: ListActionTypes.ADD_OWNER_ROLE_SUCCESS,
  payload: { listId, userId }
});

const addOwnerRoleFailure = () => ({
  type: ListActionTypes.ADD_OWNER_ROLE_FAILURE
});

const removeOwnerRoleRequest = () => ({
  type: ListActionTypes.REMOVE_OWNER_ROLE_REQUEST
});

const removeOwnerRoleSuccess = (listId, userId) => ({
  type: ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS,
  payload: { listId, userId }
});

const removeOwnerRoleFailure = () => ({
  type: ListActionTypes.REMOVE_OWNER_ROLE_FAILURE
});

const addMemberRoleSuccess = (listId, userId) => ({
  type: ListActionTypes.ADD_MEMBER_ROLE_SUCCESS,
  payload: { listId, userId }
});

const addMemberRoleRequest = () => ({
  type: ListActionTypes.ADD_MEMBER_ROLE_REQUEST
});

const addMemberRoleFailure = () => ({
  type: ListActionTypes.ADD_MEMBER_ROLE_FAILURE
});

const removeMemberRoleSuccess = (listId, userId) => ({
  type: ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS,
  payload: { listId, userId }
});

const removeMemberRoleRequest = () => ({
  type: ListActionTypes.REMOVE_MEMBER_ROLE_REQUEST
});

const removeMemberRoleFailure = () => ({
  type: ListActionTypes.REMOVE_MEMBER_ROLE_FAILURE
});

export const fetchListData = listId => dispatch => {
  dispatch(fetchListDataRequest());
  return getData(`${ENDPOINT_URL}/lists/${listId}/data`)
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

export const createList = data => dispatch => {
  dispatch(createListRequest());
  return postData(`${ENDPOINT_URL}/lists/create`, data)
    .then(resp => resp.json())
    .then(json => dispatch(createListSuccess(json)))
    .catch(() => {
      dispatch(createListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        "Oops, we're sorry, creating new list failed..."
      );
    });
};

export const fetchListsMetaData = (cohortId = null) => dispatch => {
  const url = cohortId
    ? `${ENDPOINT_URL}/lists/meta-data/${cohortId}`
    : `${ENDPOINT_URL}/lists/meta-data`;
  dispatch(fetchListsMetaDataRequest());
  return getData(url)
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

export const fetchArchivedListsMetaData = (cohortId = null) => dispatch => {
  const url = cohortId
    ? `${ENDPOINT_URL}/lists/archived/${cohortId}`
    : `${ENDPOINT_URL}/lists/archived`;
  dispatch(fetchArchivedListsMetaDataRequest());
  return getData(url)
    .then(resp => resp.json())
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchArchivedListsMetaDataSuccess(dataMap));
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
  return deleteData(`${ENDPOINT_URL}/lists/${id}/delete`)
    .then(resp =>
      resp.json().then(json => {
        dispatch(deleteListSuccess(id));
        createNotificationWithTimeout(
          dispatch,
          NotificationType.SUCCESS,
          json.message
        );
        history.replace('/dashboard');
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
  return patchData(`${ENDPOINT_URL}/lists/${listId}/update`, data)
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
  return patchData(`${ENDPOINT_URL}/lists/${listId}/update`, {
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
  return patchData(`${ENDPOINT_URL}/lists/${listId}/update`, {
    isArchived: false
  })
    .then(() => getData(`${ENDPOINT_URL}/lists/${listId}/data`))
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

export const addListToFavourites = listId => dispatch => {
  dispatch(favouritesRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/add-to-fav`)
    .then(resp => resp.json())
    .then(json => {
      dispatch(favouritesSuccess({ listId, isFavourite: true }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(favouritesFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const removeListFromFavourites = listId => dispatch => {
  dispatch(favouritesRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/remove-from-fav`)
    .then(resp => resp.json())
    .then(json => {
      dispatch(favouritesSuccess({ listId, isFavourite: false }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(favouritesFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const addListViewer = (listId, email) => dispatch => {
  dispatch(addViewerRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/add-viewer`, {
    email
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(addViewerSuccess(json, listId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message || 'Viewer added successfully.'
      );
    })
    .catch(err => {
      dispatch(addViewerFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, adding new viewer failed..."
      );
    });
};

export const removeListMember = (listId, userId, isOwner) => dispatch => {
  const url = isOwner
    ? `${ENDPOINT_URL}/lists/${listId}/remove-owner`
    : `${ENDPOINT_URL}/lists/${listId}/remove-member`;
  dispatch(removeMemberRequest());
  return patchData(url, { userId })
    .then(resp => resp.json())
    .then(json => {
      dispatch(removeMemberSuccess(listId, userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(removeMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const addOwnerRole = (listId, userId) => dispatch => {
  dispatch(addOwnerRoleRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/add-owner-role`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(addOwnerRoleSuccess(listId, userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(addOwnerRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const removeOwnerRole = (listId, userId) => dispatch => {
  dispatch(removeOwnerRoleRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/remove-owner-role`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(removeOwnerRoleSuccess(listId, userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(removeOwnerRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const addMemberRole = (listId, userId) => dispatch => {
  dispatch(addMemberRoleRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/add-member-role`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(addMemberRoleSuccess(listId, userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(addMemberRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const removeMemberRole = (listId, userId) => dispatch => {
  dispatch(removeMemberRoleRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/remove-member-role`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(removeMemberRoleSuccess(listId, userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(removeMemberRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const updateItemDetails = (listId, itemId, data) => dispatch => {
  dispatch(updateItemDetailsRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/update-item-details`, {
    ...data,
    itemId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(updateItemDetailsSuccess(listId, itemId, data));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(updateItemDetailsFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};
