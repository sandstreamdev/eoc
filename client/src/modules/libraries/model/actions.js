import { LibrariesActionTypes } from './actionTypes';
import { getJson } from 'common/utils/fetchMethods';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

const fetchLibrariesSuccess = payload => ({
  type: LibrariesActionTypes.FETCH_LIBRARIES_SUCCESS,
  payload
});

const fetchLibrariesFailure = () => ({
  type: LibrariesActionTypes.FETCH_LIBRARIES_FAILURE
});

const fetchLicenseSuccess = payload => ({
  type: LibrariesActionTypes.FETCH_LICENSE_SUCCESS,
  payload
});

const fetchLicenseFailure = () => ({
  type: LibrariesActionTypes.FETCH_LICENSE_FAILURE
});

export const fetchLibraries = () => async dispatch => {
  console.log('fetch libraries');
  try {
    const data = await getJson('/api/libraries/names');

    dispatch(fetchLibrariesSuccess(data));
  } catch (error) {
    dispatch(fetchLibrariesFailure());
    createNotificationWithTimeout(
      dispatch,
      NotificationType.ERROR,
      { notificationId: 'libraries.actions.fetch-libraries-fails' },
      error
    );
  }
};

export const fetchLicense = library => async dispatch => {
  console.log('fetch license');
  try {
    const data = await getJson(`/api/libraries/${encodeURIComponent(library)}`);

    dispatch(fetchLicenseSuccess({ library, data }));
  } catch (error) {
    dispatch(fetchLicenseFailure());
    createNotificationWithTimeout(
      dispatch,
      NotificationType.ERROR,
      { notificationId: 'libraries.actions.fetch-license-fails' },
      error
    );
  }
};
