/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import enData from '../locales/en.json';
import './styles/index.scss';
import Layout from './components/Layout';
import configureStore from './model/store';
import history from 'common/utils/history';
import { receiveEvents } from 'sockets/receiveEvents';
import socket from 'sockets';

if (!Intl.PluralRules) {
  require('@formatjs/intl-pluralrules/polyfill');
  require('@formatjs/intl-pluralrules/dist/locale-data/en');
}

if (!Intl.RelativeTimeFormat) {
  require('@formatjs/intl-relativetimeformat/polyfill');
  require('@formatjs/intl-relativetimeformat/dist/locale-data/en');
}

const store = configureStore();

receiveEvents(store, socket);

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider textComponent="span" locale="en" messages={enData}>
      <Router history={history}>
        <Layout />
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);
