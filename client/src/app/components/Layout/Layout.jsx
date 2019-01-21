import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import ShoppingList from 'modules/shopping-list';
import Dashboard from 'modules/dashboard';
import Cohort from 'modules/cohort';
import AuthBox from 'modules/legacy/AuthBox';
import Toolbar from '../Toolbar/Toolbar';
import { setCurrentUser } from 'modules/legacy/mainActions';
import { UserPropType } from 'common/constants/propTypes';
import { getCurrentUser } from 'modules/legacy/selectors';

class Layout extends Component {
  componentDidMount() {
    this.setAuthenticationState();
  }

  componentDidUpdate(prevProps) {
    const { currentUser, history } = this.props;
    const {
      currentUser: prevCurrentUser,
      location: { pathname }
    } = prevProps;
    if (!prevCurrentUser && currentUser) {
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
    return !currentUser ? (
      <Switch>
        <Route component={AuthBox} exact path="/" />
        <Redirect to="/" />
      </Switch>
    ) : (
      <Fragment>
        <Toolbar />
        <Switch>
          <Route component={Dashboard} path="/dashboard" />
          <Route component={Cohort} path="/cohort/:id(\w+)" />
          <Route component={ShoppingList} path="/list/:id(\w+)" />
          <Route component={Dashboard} />
        </Switch>
      </Fragment>
    );
  }
}

Layout.propTypes = {
  currentUser: UserPropType,
  history: PropTypes.shape({
    push: PropTypes.func
  }),

  setCurrentUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    { setCurrentUser }
  )(Layout)
);
