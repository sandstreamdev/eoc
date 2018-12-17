import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import './styles/index.scss';

import configureStore from './store/configureStore';
import Main from './components/Main';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('root')
);
