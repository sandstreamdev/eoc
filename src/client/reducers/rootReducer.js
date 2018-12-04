import { combineReducers } from 'redux';

import items from './itemsReducer';
import addItem from './itemReducer';

const rootReducer = combineReducers({
  items,
  addItem
});

export default rootReducer;
