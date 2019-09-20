import { combineReducers } from 'redux';

import cohorts from 'modules/cohort/model/reducer';
import currentUser from 'modules/user/model/reducer';
import notifications from 'modules/notification/model/reducer';
import lists from 'modules/list/model/reducer';
import activities from 'common/components/Activities/model/reducer';
import { animations } from 'modules/list/components/Items/model/reducer';

const rootReducer = combineReducers({
  animations,
  activities,
  cohorts,
  currentUser,
  lists,
  notifications
});

export default rootReducer;
