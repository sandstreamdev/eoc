import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import './styles/index.scss';
import Layout from './components/Layout';
import configureStore from './model/store';
import history from 'common/utils/history';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Layout />
    </Router>
  </Provider>,
  document.getElementById('root')
);
