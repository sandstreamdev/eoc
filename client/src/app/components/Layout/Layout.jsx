import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route, NavLink, Switch, withRouter } from 'react-router-dom';

import ShoppingList from 'modules/shopping-list';
import Dashboard from 'modules/dashboard';
import Cohort from 'modules/cohort';
import AuthBox from 'modules/legacy/AuthBox';
import Toolbar from '../Toolbar/Toolbar';
import { setCurrentUser } from 'modules/legacy/mainActions';
import { UserPropType } from 'common/constants/propTypes';

class Layout extends Component {
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
      <Fragment>
        <Toolbar />
        <div>
          <NavLink to="/dashboard">Dashboard </NavLink>
          <NavLink to="/cohort/fghdfhg567">Cohort </NavLink>
          <NavLink to="/list/asd224">List </NavLink>
        </div>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/cohort/:id(\w+)" component={Cohort} />
          <Route path="/list/:id(\w+)" component={ShoppingList} />
          <Route component={Dashboard} />
        </Switch>
      </Fragment>
    );
    return routes;
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
  currentUser: state.currentUser
});

export default withRouter(
  connect(
    mapStateToProps,
    { setCurrentUser }
  )(Layout)
);
