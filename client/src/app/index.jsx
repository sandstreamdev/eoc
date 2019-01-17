import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink
} from 'react-router-dom';

import configureStore from './model/store';
import Dashboard from 'modules/dashboard/components/Dashboard';
import Main from 'modules/main/components/Main';
import Cohort from 'modules/cohort/components/Cohort';
import ShoppingList from 'modules/shopping-list/components/ShoppingList';

import './styles/index.scss';

const store = configureStore();
const eoc = (
  <Provider store={store}>
    <Router>
      <div>
        <nav>
          <NavLink to="/">Main</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/cohort/12">Cohort</NavLink>
          <NavLink to="/list/1">List</NavLink>
        </nav>
        <main>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/cohort/:id" component={Cohort} />
            <Route path="/list/:id" component={ShoppingList} />
            <Redirect to="/" />
          </Switch>
        </main>
      </div>
    </Router>
  </Provider>
);

ReactDOM.render(eoc, document.getElementById('root'));
