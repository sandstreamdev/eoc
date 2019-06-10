import { getData } from 'common/utils/fetchMethods';
import { ActivitiesActionTypes } from './actionTypes';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';

const fetchActivitiesSuccess = activities => ({
  type: ActivitiesActionTypes.FETCH_SUCCESS,
  payload: activities
});

const fetchActivitiesFailure = () => ({
  type: ActivitiesActionTypes.FETCH_FAILURE
});

export const fetchActivities = () => dispatch =>
  getData('/api/activities/data')
    .then(resp => resp.json())
    .then(json => dispatch(fetchActivitiesSuccess(json)))
    .catch(err => {
      dispatch(fetchActivitiesFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        'Failed to fetch activities. Please try again.'
      );
    });
