import { combineReducers } from 'redux';

import items from './itemsReducer';
import addItem from './itemReducer';

const rootReducer = combineReducers({
  addItem,
  items
});

export default rootReducer;
