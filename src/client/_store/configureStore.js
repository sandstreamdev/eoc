import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducer from '../_reducers/rootReducer';

export default function configureStore() {
  console.log('Configuring store, /_STORE/configureStore.js');
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
}
