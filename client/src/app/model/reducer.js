import { combineReducers } from 'redux';

import cohorts from 'modules/cohort/model/reducer';
import currentUser from 'modules/authorization/model/reducer';
import notifications from 'modules/notification/model/reducer';
import lists from 'modules/list/model/reducer';
import members from 'modules/members/model/reducer';

const rootReducer = combineReducers({
  cohorts,
  currentUser,
  lists,
  notifications,
  members
});

export default rootReducer;
