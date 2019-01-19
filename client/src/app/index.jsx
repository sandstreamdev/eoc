import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import './styles/index.scss';
import Eoc from './components/Eoc';
import configureStore from './model/store';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Eoc />
    </Router>
  </Provider>,
  document.getElementById('root')
);
