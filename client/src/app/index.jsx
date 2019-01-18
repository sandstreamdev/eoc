import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import configureStore from './model/store';
import Dashboard from 'modules/dashboard';
import Main from 'modules/main/';
import Cohort from 'modules/cohort/';
import ShoppingList from 'modules/shopping-list/';

import './styles/index.scss';

const store = configureStore();
const eoc = (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/cohort/:id(\w+)" component={Cohort} />
        <Route path="/list/:id(\w+)" component={ShoppingList} />
        <Redirect to="/" />
      </Switch>
    </Router>
  </Provider>
);

ReactDOM.render(eoc, document.getElementById('root'));
