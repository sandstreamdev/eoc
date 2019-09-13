import _keyBy from 'lodash/keyBy';

import { getJson, patchData, postData } from 'common/utils/fetchMethods';
import { ListActionTypes, ListHeaderStatusType } from './actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import history from 'common/utils/history';
import { UserAddingStatus } from 'common/components/Members/const';
import { ResourceNotFoundException } from 'common/exceptions';
import socket from 'sockets';
import { ListType } from 'modules/list/consts';
import { cohortRoute, dashboardRoute } from 'common/utils/helpers';

const fetchListDataFailure = () => ({
  type: ListActionTypes.FETCH_DATA_FAILURE
});
const fetchListDataSuccess = payload => ({
  type: ListActionTypes.FETCH_DATA_SUCCESS,
  payload
});

const createListSuccess = payload => ({
  type: ListActionTypes.CREATE_SUCCESS,
  payload
});

const createListFailure = () => ({
  type: ListActionTypes.CREATE_FAILURE
});

const deleteListSuccess = payload => ({
  type: ListActionTypes.DELETE_SUCCESS,
  payload
});

const deleteListFailure = () => ({
  type: ListActionTypes.DELETE_FAILURE
});

const updateListSuccess = payload => ({
  type: ListActionTypes.UPDATE_SUCCESS,
  payload
});

const updateListFailure = () => ({
  type: ListActionTypes.UPDATE_FAILURE
});

const fetchListsMetaDataSuccess = payload => ({
  type: ListActionTypes.FETCH_META_DATA_SUCCESS,
  payload
});

const fetchListsMetaDataFailure = () => ({
  type: ListActionTypes.FETCH_META_DATA_FAILURE
});

const fetchArchivedListsMetaDataSuccess = payload => ({
  type: ListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS,
  payload
});

const fetchArchivedListsMetaDataFailure = () => ({
  type: ListActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE
});

const archiveListSuccess = payload => ({
  type: ListActionTypes.ARCHIVE_SUCCESS,
  payload
});

const archiveListFailure = () => ({
  type: ListActionTypes.ARCHIVE_FAILURE
});

const restoreListSuccess = payload => ({
  type: ListActionTypes.RESTORE_SUCCESS,
  payload
});

const restoreListFailure = () => ({
  type: ListActionTypes.RESTORE_FAILURE
});

export const removeArchivedListsMetaData = () => ({
  type: ListActionTypes.REMOVE_ARCHIVED_META_DATA
});

const favouritesSuccess = payload => ({
  type: ListActionTypes.FAVOURITES_SUCCESS,
  payload
});

const favouritesFailure = () => ({
  type: ListActionTypes.FAVOURITES_FAILURE
});

const addViewerSuccess = payload => ({
  type: ListActionTypes.ADD_VIEWER_SUCCESS,
  payload
});

const addViewerFailure = () => ({
  type: ListActionTypes.ADD_VIEWER_FAILURE
});

const removeMemberFailure = () => ({
  type: ListActionTypes.REMOVE_MEMBER_FAILURE
});

const removeMemberSuccess = payload => ({
  type: ListActionTypes.REMOVE_MEMBER_SUCCESS,
  payload
});

const addOwnerRoleSuccess = payload => ({
  type: ListActionTypes.ADD_OWNER_ROLE_SUCCESS,
  payload
});

const addOwnerRoleFailure = () => ({
  type: ListActionTypes.ADD_OWNER_ROLE_FAILURE
});

const removeOwnerRoleSuccess = payload => ({
  type: ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS,
  payload
});

const removeOwnerRoleFailure = () => ({
  type: ListActionTypes.REMOVE_OWNER_ROLE_FAILURE
});

const addMemberRoleSuccess = payload => ({
  type: ListActionTypes.ADD_MEMBER_ROLE_SUCCESS,
  payload
});

const addMemberRoleFailure = () => ({
  type: ListActionTypes.ADD_MEMBER_ROLE_FAILURE
});

const removeMemberRoleSuccess = data => ({
  type: ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS,
  payload: data
});

const removeMemberRoleFailure = () => ({
  type: ListActionTypes.REMOVE_MEMBER_ROLE_FAILURE
});

const changeTypeSuccess = payload => ({
  type: ListActionTypes.CHANGE_TYPE_SUCCESS,
  payload
});

const changeTypeFailure = () => ({
  type: ListActionTypes.CHANGE_TYPE_FAILURE
});

const leaveListSuccess = payload => ({
  type: ListActionTypes.LEAVE_SUCCESS,
  payload
});

const leaveListFailure = () => ({
  type: ListActionTypes.LEAVE_FAILURE
});

const fetchAvailableListsSuccess = payload => ({
  type: ListActionTypes.FETCH_AVAILABLE_SUCCESS,
  payload
});

const fetchAvailableListsFailure = payload => ({
  type: ListActionTypes.FETCH_AVAILABLE_FAILURE,
  payload
});

export const fetchListData = listId => dispatch =>
  getJson(`/api/lists/${listId}/data`)
    .then(json => {
      const data = {
        ...json,
        items: _keyBy(json.items, '_id'),
        members: _keyBy(json.members, '_id')
      };
      dispatch(fetchListDataSuccess({ data, listId }));
    })
    .catch(err => {
      if (!(err instanceof ResourceNotFoundException)) {
        dispatch(fetchListDataFailure());
        createNotificationWithTimeout(
          dispatch,
          NotificationType.ERROR,
          {
            notificationId: 'list.actions.fetch-data-fail'
          },
          err
        );
      }

      throw err;
    });

export const createList = data => dispatch =>
  postData('/api/lists/create', data)
    .then(response => response.json())
    .then(json => {
      const action = createListSuccess(json);

      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.create-list',
        data: data.name
      });
    })
    .catch(err => {
      dispatch(createListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.create-list-fail',
          data: data.name
        },
        err
      );
    });

export const fetchListsMetaData = (cohortId = null) => dispatch => {
  const url = cohortId
    ? `/api/lists/meta-data/${cohortId}`
    : '/api/lists/meta-data';

  return getJson(url)
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchListsMetaDataSuccess(dataMap));
    })
    .catch(err => {
      dispatch(fetchListsMetaDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.fetch-meta-data-fail'
        },
        err
      );
    });
};

export const fetchArchivedListsMetaData = (cohortId = null) => dispatch => {
  const url = cohortId
    ? `/api/lists/archived/${cohortId}`
    : '/api/lists/archived';

  return getJson(url)
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchArchivedListsMetaDataSuccess(dataMap));
    })
    .catch(err => {
      dispatch(fetchArchivedListsMetaDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.fetch-arch-meta-data-fail'
        },
        err
      );
    });
};

export const deleteList = (listId, listName, cohortId) => dispatch =>
  patchData(`/api/lists/${listId}/update`, { isDeleted: true, listId })
    .then(() => {
      const action = deleteListSuccess({ listId, cohortId });

      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.delete-list',
        data: listName
      });
      history.replace(dashboardRoute());
    })
    .catch(err => {
      dispatch(deleteListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.delete-list-fail',
          data: listName
        },
        err
      );
      throw new Error();
    });

export const updateList = (listId, data, listName) => dispatch =>
  patchData(`/api/lists/${listId}/update`, data)
    .then(() => {
      dispatch(updateListSuccess({ ...data, listId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.update-list',
        data: listName
      });
    })
    .catch(err => {
      dispatch(updateListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.update-list-fail',
          data: listName
        },
        err
      );
    });

export const archiveList = (listId, listName, cohortId) => dispatch =>
  patchData(`/api/lists/${listId}/update`, {
    isArchived: true
  })
    .then(() => {
      const action = archiveListSuccess({ cohortId, isArchived: true, listId });

      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.arch-list',
        data: listName
      });
      const url = cohortId ? cohortRoute(cohortId) : dashboardRoute();
      history.replace(url);
    })
    .catch(err => {
      dispatch(archiveListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.arch-list-fail',
          data: listName
        },
        err
      );
    });

export const restoreList = (listId, listName) => dispatch =>
  patchData(`/api/lists/${listId}/update`, {
    isArchived: false
  })
    .then(() => getJson(`/api/lists/${listId}/data`))
    .then(json => {
      const data = {
        ...json,
        items: _keyBy(json.items, '_id'),
        members: _keyBy(json.members, '_id')
      };
      const action = restoreListSuccess({ data, listId });

      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.restore-list',
        data: listName
      });
    })
    .catch(err => {
      dispatch(restoreListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.restore-list-fail',
          data: listName
        },
        err
      );
    });

export const addListToFavourites = (listId, listName) => dispatch =>
  patchData(`/api/lists/${listId}/add-to-fav`)
    .then(() => {
      dispatch(favouritesSuccess({ listId, isFavourite: true }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.add-to-fav',
        data: listName
      });
    })
    .catch(err => {
      dispatch(favouritesFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.add-to-fav-fail',
          data: listName
        },
        err
      );
    });

export const removeListFromFavourites = (listId, listName) => dispatch =>
  patchData(`/api/lists/${listId}/remove-from-fav`)
    .then(() => {
      dispatch(favouritesSuccess({ listId, isFavourite: false }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.remove-from-fav',
        data: listName
      });
    })
    .catch(err => {
      dispatch(favouritesFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.remove-from-fav-fail',
          data: listName
        },
        err
      );
    });

export const addListViewer = (listId, email) => dispatch =>
  patchData(`/api/lists/${listId}/add-viewer`, {
    email
  })
    .then(response => response.json())
    .then(json => {
      if (json._id) {
        const action = addViewerSuccess({ listId, ...json });

        dispatch(action);
        createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
          notificationId: 'list.actions.add-viewer',
          data: json.displayName
        });

        return UserAddingStatus.ADDED;
      }

      return UserAddingStatus.NO_USER;
    })
    .catch(err => {
      dispatch(addViewerFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: err.message || 'list.actions.add-viewer-default-fail',
          data: email
        },
        err
      );
    });

export const removeListMember = (
  listId,
  userName,
  userId,
  isOwner
) => dispatch => {
  const url = isOwner
    ? `/api/lists/${listId}/remove-owner`
    : `/api/lists/${listId}/remove-member`;

  return patchData(url, { userId })
    .then(() => {
      dispatch(removeMemberSuccess({ listId, userId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.remove-member',
        data: userName
      });
    })
    .catch(err => {
      dispatch(removeMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.remove-member-fail',
          data: userName
        },
        err
      );
    });
};

export const addOwnerRole = (listId, userId, userName) => dispatch =>
  patchData(`/api/lists/${listId}/add-owner-role`, {
    userId
  })
    .then(() => {
      const action = addOwnerRoleSuccess({
        isCurrentUserRoleChanging: false,
        listId,
        userId
      });

      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'common.owner-role',
        data: userName
      });
    })
    .catch(err => {
      dispatch(addOwnerRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.add-owner-role-fail',
          data: userName
        },
        err
      );
    });

export const removeOwnerRole = (
  listId,
  userId,
  userName,
  isCurrentUserRoleChanging
) => dispatch =>
  patchData(`/api/lists/${listId}/remove-owner-role`, {
    userId
  })
    .then(() => {
      const action = removeOwnerRoleSuccess({
        isCurrentUserRoleChanging,
        listId,
        userId
      });

      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'common.no-owner-role',
        data: userName
      });
    })
    .catch(err => {
      dispatch(removeOwnerRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: err.message || 'list.actions.remove-owner-role-fail',
          data: userName
        },
        err
      );
    });

export const addMemberRole = (
  listId,
  userId,
  userName,
  isCurrentUserAnOwner
) => dispatch =>
  patchData(`/api/lists/${listId}/add-member-role`, {
    userId
  })
    .then(() => {
      const action = addMemberRoleSuccess({
        isCurrentUserAnOwner,
        listId,
        userId
      });

      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.add-member-role',
        data: userName
      });
    })
    .catch(err => {
      dispatch(addMemberRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.add-member-role-fail',
          data: userName
        },
        err
      );
    });

export const removeMemberRole = (
  listId,
  userId,
  userName,
  isCurrentUserAnOwner
) => dispatch =>
  patchData(`/api/lists/${listId}/remove-member-role`, {
    userId
  })
    .then(() => {
      const action = removeMemberRoleSuccess({
        isCurrentUserAnOwner,
        listId,
        userId
      });

      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.remove-member-role',
        data: userName
      });
    })
    .catch(err => {
      dispatch(removeMemberRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: err.message || 'list.actions.remove-member-role-fail',
          data: userName
        },
        err
      );
    });

export const changeType = (listId, listName, type) => dispatch =>
  patchData(`/api/lists/${listId}/change-type`, {
    type
  })
    .then(response => response.json())
    .then(json => {
      const listData = {
        ...json,
        members: _keyBy(json.members, '_id')
      };
      const action = changeTypeSuccess({ listId, ...listData, type });

      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.change-type',
        data: listName
      });
    })
    .catch(err => {
      dispatch(changeTypeFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.change-type-fail',
          data: listName
        },
        err
      );
    });

export const leaveList = (
  listId,
  userId,
  cohortId,
  userName,
  type
) => dispatch =>
  patchData(`/api/lists/${listId}/leave`)
    .then(() => {
      const action = leaveListSuccess({ listId, userId });
      const { type } = action;

      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.leave',
        data: userName
      });
      const goToCohort = cohortId && type === ListType.LIMITED;
      const url = goToCohort ? cohortRoute(cohortId) : dashboardRoute();

      history.replace(url);
    })
    .catch(err => {
      dispatch(leaveListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: err.message || 'list.actions.leave-fail',
          data: userName
        },
        err
      );
    });

export const fetchAvailableLists = () => dispatch =>
  getJson('/api/lists/for-item')
    .then(lists => dispatch(fetchAvailableListsSuccess(_keyBy(lists, '_id'))))
    .catch(err => {
      dispatch(fetchAvailableListsFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.actions.fetch-meta-data-fail'
        },
        err
      );
    });

export const lockListHeader = (
  listId,
  userId,
  { nameLock, descriptionLock }
) => {
  socket.emit(ListHeaderStatusType.LOCK, {
    descriptionLock,
    listId,
    nameLock,
    userId
  });
};

export const unlockListHeader = (
  listId,
  userId,
  { nameLock, descriptionLock }
) => {
  socket.emit(ListHeaderStatusType.UNLOCK, {
    descriptionLock,
    listId,
    nameLock,
    userId
  });
};
