import _keyBy from 'lodash/keyBy';

import { getData } from 'common/utils/fetchMethods';
import { ActivitiesActionTypes } from './actionTypes';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';

const fetchActivitiesSuccess = (activities, page) => ({
  type: ActivitiesActionTypes.FETCH_SUCCESS,
  payload: { activities, page }
});

const fetchActivitiesFailure = () => ({
  type: ActivitiesActionTypes.FETCH_FAILURE
});

export const fetchActivities = () => dispatch =>
  getData('/api/activities/data')
    .then(resp => resp.json())
    .then(json => {
      const { activities, page } = json;
      const activitiesData = _keyBy(activities, '_id');
      dispatch(fetchActivitiesSuccess(activitiesData, page));
    })
    .catch(() => {
      dispatch(fetchActivitiesFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        'Failed to fetch activities. Please try again.'
      );
    });
