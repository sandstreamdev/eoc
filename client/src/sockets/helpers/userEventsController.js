import { UserEvents } from 'sockets/enums';
import history from 'common/utils/history';
import { saveData, storageKeys } from 'common/utils/localStorage';
import { accountDeletedRoute } from 'common/utils/helpers';

const userEventsController = (event, data, { dispatch }) => {
  switch (event) {
    case UserEvents.LOGOUT_SUCCESS: {
      saveData(storageKeys.account, 'deleted');
      dispatch({
        type: UserEvents.LOGOUT_SUCCESS
      });
      history.replace(accountDeletedRoute());

      return localStorage.clear();
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};

export default userEventsController;
