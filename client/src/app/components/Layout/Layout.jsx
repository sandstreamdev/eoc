import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import List from 'modules/list';
import Dashboard from 'modules/dashboard';
import Cohort from 'modules/cohort';
import AuthBox from 'modules/authorization/AuthBox';
import { loginUser } from 'modules/authorization/model/actions';
import { UserPropType, IntlPropType } from 'common/constants/propTypes';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import Footer from '../Footer';
import Notifications from 'modules/notification';
import Page404 from 'common/components/Page404';
import About from 'modules/about';
import PrivacyPolicy from 'modules/privacy-policy';
import Cohorts from 'modules/cohort/components/Cohorts';
import Toolbar, { ToolbarItem } from './Toolbar';
import { ListViewIcon, TilesViewIcon } from 'assets/images/icons';
import { Routes, ViewType } from 'common/constants/enums';

export class Layout extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      viewType: ViewType.LIST
    };
  }

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
    const { loginUser } = this.props;

    loginUser();
  };

  isListsView = () => {
    const {
      location: { pathname }
    } = this.props;

    return (
      pathname.includes(`${Routes.COHORT}/`) ||
      pathname.includes(Routes.DASHBOARD)
    );
  };

  handleSwitchToListView = () => this.setState({ viewType: ViewType.LIST });

  handleSwitchToTilesView = () => this.setState({ viewType: ViewType.TILES });

  handleViewTypeChange = () => {
    const { viewType } = this.state;

    return viewType === ViewType.LIST
      ? this.handleSwitchToTilesView
      : this.handleSwitchToListView;
  };

  render() {
    const {
      currentUser,
      intl: { formatMessage }
    } = this.props;
    const { viewType } = this.state;

    return !currentUser ? (
      <Switch>
        <Route component={AuthBox} exact path="/" />
        <Route component={PrivacyPolicy} path="/privacy-policy" />
        <Redirect to="/" />
      </Switch>
    ) : (
      <Fragment>
        <Notifications />
        <Toolbar>
          {this.isListsView() && (
            <ToolbarItem
              mainIcon={
                viewType === ViewType.LIST ? (
                  <TilesViewIcon />
                ) : (
                  <ListViewIcon />
                )
              }
              onClick={this.handleViewTypeChange()}
              title={
                viewType === ViewType.LIST
                  ? formatMessage({
                      id: 'app.layout.list-view'
                    })
                  : formatMessage({
                      id: 'app.layout.tile-view'
                    })
              }
            />
          )}
        </Toolbar>
        <Switch>
          <Redirect from="/" exact to="/dashboard" />
          <Route
            path="/dashboard"
            render={props => <Dashboard {...props} viewType={viewType} />}
          />
          <Route
            path="/cohort/:id(\w+)"
            render={props => <Cohort {...props} viewType={viewType} />}
          />
          <Route component={List} path="/sack/:id(\w+)" />
          <Route component={About} path="/about" />
          <Route component={PrivacyPolicy} path="/privacy-policy" />
          <Route component={Cohorts} path="/cohorts" />
          <Route component={Page404} />
        </Switch>
        <Footer />
      </Fragment>
    );
  }
}

Layout.propTypes = {
  currentUser: UserPropType,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  intl: IntlPropType,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }),

  loginUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default injectIntl(
  withRouter(
    connect(
      mapStateToProps,
      { loginUser }
    )(Layout)
  )
);
