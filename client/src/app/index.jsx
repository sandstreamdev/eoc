import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import './styles/index.scss';

import Layout from './components/Layout/Layout';
import ShoppingList from 'modules/shopping-list';
import Dashboard from 'modules/dashboard';
import Cohort from 'modules/cohort';
import Auth from './components/Auth';
import configureStore from './model/store';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Auth} />
          <Redirect to="/" />
        </Switch>
        <Layout>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/cohort/:id(\w+)" component={Cohort} />
            <Route path="/list/:id(\w+)" component={ShoppingList} />
            <Redirect to="/dashboard" />
          </Switch>
        </Layout>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
