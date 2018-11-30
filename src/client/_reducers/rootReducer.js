import { combineReducers } from 'redux';

import items from './itemsReducer';

console.log('Combining reducers, /_REDUCERS/rootReducer.js');
const rootReducer = combineReducers({
  items
});

export default rootReducer;
