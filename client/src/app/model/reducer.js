import { combineReducers } from 'redux';

import cohorts from 'modules/cohort/model/reducer';
import currentUser from 'modules/authorization/model/reducer';
import notifications from 'modules/notification/model/reducer';
import lists from 'modules/list/model/reducer';
import users from 'modules/members/model/reducer';

const rootReducer = combineReducers({
  cohorts,
  currentUser,
  lists,
  notifications,
  users
});

export default rootReducer;
