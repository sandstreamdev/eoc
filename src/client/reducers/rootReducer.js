import { combineReducers } from 'redux';

import items from './itemsReducer';
import addItem, { addItemSuccess } from './itemReducer';

const rootReducer = combineReducers({
  addItem,
  addItemSuccess,
  items
});

export default rootReducer;
