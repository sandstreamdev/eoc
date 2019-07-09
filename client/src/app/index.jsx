import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import io from 'socket.io-client';

import enData from '../locales/en.json';
import './styles/index.scss';
import Layout from './components/Layout';
import configureStore from './model/store';
import history from 'common/utils/history';
import SocketContext from 'common/context/socket-context';

addLocaleData([...en]);
const store = configureStore();
const socket = io();

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale="en" messages={enData}>
      <Router history={history}>
        <SocketContext.Provider value={socket}>
          <Layout />
        </SocketContext.Provider>
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);
