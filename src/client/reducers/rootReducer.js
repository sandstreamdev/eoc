import { combineReducers } from 'redux';

import items from './itemsReducer';

const rootReducer = combineReducers({
  items
});

export default rootReducer;
