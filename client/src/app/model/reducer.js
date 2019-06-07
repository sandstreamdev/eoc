import { combineReducers } from 'redux';

import cohorts from 'modules/cohort/model/reducer';
import currentUser from 'modules/authorization/model/reducer';
import notifications from 'modules/notification/model/reducer';
import lists from 'modules/list/model/reducer';
import activities from 'modules/activity/model/reducer';

const rootReducer = combineReducers({
  activities,
  cohorts,
  currentUser,
  lists,
  notifications
});

export default rootReducer;
