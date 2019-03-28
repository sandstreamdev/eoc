import { UsersActionTypes } from './actionTypes';
import { getData } from 'common/utils/fetchMethods';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';

const fetchUsersRequest = () => ({
  type: UsersActionTypes.FETCH_REQUEST
});

const fetchUsersFailure = () => ({
  type: UsersActionTypes.FETCH_FAIULRE
});

const fetchUsersSuccess = data => ({
  type: UsersActionTypes.FETCH_SUCCESS,
  payload: data
});

export const fetchUsers = () => dispatch => {
  dispatch(fetchUsersRequest());
  return getData('path')
    .then(resp => resp.json())
    .then(json => dispatch(fetchUsersSuccess(json)))
    .catch(err => {
      dispatch(fetchUsersFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching users failed..."
      );
    });
};
