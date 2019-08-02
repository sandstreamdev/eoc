import _keyBy from 'lodash/keyBy';

import { getData } from 'common/utils/fetchMethods';
import { ActivitiesActionTypes } from './actionTypes';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';

const fetchActivitiesSuccess = payload => ({
  type: ActivitiesActionTypes.FETCH_SUCCESS,
  payload
});

const fetchActivitiesFailure = () => ({
  type: ActivitiesActionTypes.FETCH_FAILURE
});

export const removeActivities = () => ({
  type: ActivitiesActionTypes.REMOVE
});

export const fetchActivities = page => dispatch =>
  getData(`/api/activities/data/${page}`)
    .then(response => response.json())
    .then(json => {
      const { activities, isNextPage, nextPage } = json;

      dispatch(
        fetchActivitiesSuccess({
          activities: _keyBy(activities, '_id'),
          isNextPage,
          nextPage
        })
      );
    })
    .catch(() => {
      dispatch(fetchActivitiesFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        'Failed to fetch activities. Please try again.'
      );
    });
