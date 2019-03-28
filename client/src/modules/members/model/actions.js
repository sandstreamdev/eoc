import _keyBy from 'lodash/keyBy';

import { MembersActionTypes } from './actionTypes';
import { getData } from 'common/utils/fetchMethods';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';
import { ENDPOINT_URL } from 'common/constants/variables';

const fetchMembersRequest = () => ({
  type: MembersActionTypes.FETCH_REQUEST
});

const fetchMembersFailure = () => ({
  type: MembersActionTypes.FETCH_FAIULRE
});

const fetchMembersSuccess = data => ({
  type: MembersActionTypes.FETCH_SUCCESS,
  payload: data
});

const clearMembersRequest = () => ({
  type: MembersActionTypes.CLEAR_DATA
});

export const fetchCohortMembers = cohortId => dispatch => {
  dispatch(fetchMembersRequest());
  return getData(`${ENDPOINT_URL}/cohorts/${cohortId}/get-members`)
    .then(resp => resp.json())
    .then(json => {
      const data = _keyBy(json, '_id');
      dispatch(fetchMembersSuccess(data));
    })
    .catch(err => {
      dispatch(fetchMembersFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching users failed..."
      );
    });
};

export const clearMembers = () => dispatch => {
  dispatch(clearMembersRequest());
};
