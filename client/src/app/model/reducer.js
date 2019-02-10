import { combineReducers } from 'redux';

import { uiStatus, shoppingLists } from 'modules/shopping-list/model/reducer';
import currentUser from 'modules/authorization/model/reducer';
import { cohorts } from 'modules/cohort/model/reducer';

const rootReducer = combineReducers({
  cohorts,
  currentUser,
  shoppingLists,
  uiStatus
});

export default rootReducer;
