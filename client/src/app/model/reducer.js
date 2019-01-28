import { combineReducers } from 'redux';

import items, {
  uiStatus,
  shoppingLists
} from 'modules/shopping-list/model/reducer';
import currentUser from 'modules/authorization/model/reducer';
import { cohortsList } from 'modules/cohort/model/reducer';

const rootReducer = combineReducers({
  cohortsList,
  currentUser,
  items,
  shoppingLists,
  uiStatus
});

export default rootReducer;
