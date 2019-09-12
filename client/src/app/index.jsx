import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import enData from '../locales/en.json';
import './styles/index.scss';
import Layout from './components/Layout';
import configureStore from './model/store';
import history from 'common/utils/history';
import { receiveEvents } from 'sockets/receiveEvents';
import socket from 'sockets';

addLocaleData([...en]);
const store = configureStore();

receiveEvents(store, socket);

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale="en" messages={enData}>
      <Router history={history}>
        <Layout />
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);
