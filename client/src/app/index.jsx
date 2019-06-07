import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import pl from 'react-intl/locale-data/pl';

import localeData from '../locales/data.json';
import './styles/index.scss';
import Layout from './components/Layout';
import configureStore from './model/store';
import history from 'common/utils/history';

addLocaleData([...en, ...pl]);
const store = configureStore();
const englishMessages = localeData.pl;

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale="en" messages={englishMessages}>
      <Router history={history}>
        <Layout />
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);
