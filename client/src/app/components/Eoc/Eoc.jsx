import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Layout from '../Layout/Layout';
import ShoppingList from 'modules/shopping-list';
import Dashboard from 'modules/dashboard';
import Cohort from 'modules/cohort';
import AuthBox from 'modules/legacy/AuthBox';
import { setCurrentUser } from 'modules/legacy/mainActions';
import { UserPropType } from 'common/constants/propTypes';

class Eoc extends Component {
  componentDidMount() {
    this.setAuthenticationState();
  }

  componentDidUpdate(prevProps) {
    const { currentUser, history } = this.props;
    const {
      location: { pathname }
    } = prevProps;
    if (!prevProps.currentUser && currentUser) {
      const newPath = pathname === '/' ? '/dashboard' : pathname;
      history.push(newPath);
    }
  }

  setAuthenticationState = () => {
    const { setCurrentUser } = this.props;
    setCurrentUser();
  };

  render() {
    const { currentUser } = this.props;
    const routes = !currentUser ? (
      <Switch>
        <Route exact path="/" component={AuthBox} />
        <Redirect to="/" />
      </Switch>
    ) : (
      <Layout>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/cohort/:id(\w+)" component={Cohort} />
          <Route path="/list/:id(\w+)" component={ShoppingList} />
          <Redirect to="/dashboard" />
        </Switch>
      </Layout>
    );
    return routes;
  }
}

Eoc.propTypes = {
  currentUser: UserPropType,
  history: PropTypes.shape({
    push: PropTypes.func
  }),

  setCurrentUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: state.currentUser
});

export default withRouter(
  connect(
    mapStateToProps,
    { setCurrentUser }
  )(Eoc)
);
