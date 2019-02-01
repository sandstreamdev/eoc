import { combineReducers } from 'redux';

import products, {
  uiStatus,
  shoppingLists
} from 'modules/shopping-list/model/reducer';
import currentUser from 'modules/authorization/model/reducer';
import { cohorts } from 'modules/cohort/model/reducer';

const rootReducer = combineReducers({
  cohorts,
  currentUser,
  products,
  shoppingLists,
  uiStatus
});

export default rootReducer;
