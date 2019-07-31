import _keyBy from 'lodash/keyBy';

import { getData } from 'common/utils/fetchMethods';
import { ActivitiesActionTypes } from './actionTypes';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';

const fetchActivitiesSuccess = (activities, isNextPage, nextPage) => ({
  type: ActivitiesActionTypes.FETCH_SUCCESS,
  payload: { activities, isNextPage, nextPage }
});

const fetchActivitiesFailure = () => ({
  type: ActivitiesActionTypes.FETCH_FAILURE
});

export const removeActivities = () => ({
  type: ActivitiesActionTypes.REMOVE
});

export const fetchActivities = page => dispatch =>
  getData(`/api/activities/data/${page}`)
    .then(resp => resp.json())
    .then(json => {
      const { activities, isNextPage, nextPage } = json;
      const activitiesData = _keyBy(activities, '_id');
      dispatch(fetchActivitiesSuccess(activitiesData, isNextPage, nextPage));
    })
    .catch(() => {
      dispatch(fetchActivitiesFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        'Failed to fetch activities. Please try again.'
      );
    });

export const resetShouldUpdate = () => dispatch =>
  dispatch({
    type: ActivitiesActionTypes.SHOULD_UPDATE,
    payload: false
  });
