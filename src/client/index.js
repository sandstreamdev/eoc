import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import './styles/index.scss';

import configureStore from './store/configureStore';
import App from './App';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
