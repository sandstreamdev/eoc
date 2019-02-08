import { combineReducers } from 'redux';

import cohorts from 'modules/cohort/model/reducer';
import currentUser from 'modules/authorization/model/reducer';
import notifications from 'modules/notification/model/reducer';
import shoppingLists from 'modules/shopping-list/model/reducer';

const rootReducer = combineReducers({
  cohorts,
  currentUser,
  notifications,
  shoppingLists
});

export default rootReducer;
