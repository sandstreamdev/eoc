import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducer from './reducer';
import { preventDispatchForPerformer } from './middleware';

const configureStore = () =>
  createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(preventDispatchForPerformer, thunk))
  );

export default configureStore;
