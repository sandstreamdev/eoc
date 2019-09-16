import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';

import List from 'modules/list';
import Dashboard from 'modules/dashboard';
import Cohort from 'modules/cohort';
import {
  AuthBox,
  LinkExpired,
  PasswordRecoveryForm,
  ResetPassword,
  SuccessMessage,
  UserProfile
} from 'modules/user';
import { getLoggedUser } from 'modules/user/model/actions';
import { UserPropType, IntlPropType } from 'common/constants/propTypes';
import { getCurrentUser } from 'modules/user/model/selectors';
import Footer from '../Footer';
import Notifications from 'modules/notification';
import Page404 from 'common/components/Page404';
import About from 'modules/about';
import PrivacyPolicy from 'modules/privacy-policy';
import Cohorts from 'modules/cohort/components/Cohorts';
import Toolbar, { ToolbarItem } from './Toolbar';
import { ListViewIcon, TilesViewIcon } from 'assets/images/icons';
import { Routes, ViewType } from 'common/constants/enums';
import Preloader from 'common/components/Preloader';
import { loadSettings, saveSettings } from 'common/utils/localStorage';
import { clearMetaDataSuccess } from 'common/model/actions';

export class Layout extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pending: false,
      pendingForViewType: false,
      viewType: ViewType.LIST
    };
  }

  componentDidMount() {
    const settings = loadSettings();
    const {
      currentUser,
      getLoggedUser,
      history,
      location: { pathname }
    } = this.props;

    if (_isEmpty(currentUser)) {
      this.setState({ pending: true });
      getLoggedUser()
        .then(() => {
          history.push(pathname);
        })
        .finally(() => this.setState({ pending: false }));
    }

    if (settings) {
      const { viewType } = settings;
      this.setState({ viewType });
    }
  }

  componentDidUpdate(previousProps) {
    const {
      clearMetaDataSuccess,
      location: { pathname }
    } = this.props;
    const {
      location: { previousPathname }
    } = previousProps;

    if (previousPathname !== pathname) {
      clearMetaDataSuccess();
    }
  }

  isListsView = () => {
    const {
      location: { pathname }
    } = this.props;

    return (
      pathname.includes(`${Routes.COHORT}/`) ||
      pathname.includes(Routes.DASHBOARD)
    );
  };

  handleViewTypeChange = () => {
    const { viewType } = this.state;
    const newViewType =
      viewType === ViewType.LIST ? ViewType.TILES : ViewType.LIST;

    this.setState({ viewType: newViewType }, this.handleSaveSettings);
  };

  handleSaveSettings = () => {
    const { viewType } = this.state;
    const settings = { viewType };

    saveSettings(settings);
  };

  render() {
    const {
      currentUser,
      intl: { formatMessage }
    } = this.props;
    const { pending, pendingForViewType, viewType } = this.state;

    if (pending) {
      return <Preloader />;
    }

    return !currentUser ? (
      <Fragment>
        <Notifications />
        <Switch>
          <Route component={AuthBox} exact path="/" />
          <Route component={PrivacyPolicy} path="/privacy-policy" />
          <Route component={SuccessMessage} path="/account-created" />
          <Route
            component={LinkExpired}
            path="/confirmation-link-expired/:token?"
          />
          <Route
            component={ResetPassword}
            path="/reset-password/:tokenExpired?"
          />
          <Route
            component={PasswordRecoveryForm}
            path="/password-recovery/:token?"
          />
          <Route component={SuccessMessage} path="/password-recovery-success" />
          <Redirect to="/" />
        </Switch>
      </Fragment>
    ) : (
      <Fragment>
        <Notifications />
        <Toolbar>
          {this.isListsView() && (
            <ToolbarItem
              disabled={pendingForViewType}
              mainIcon={
                viewType === ViewType.LIST ? (
                  <TilesViewIcon />
                ) : (
                  <ListViewIcon />
                )
              }
              onClick={this.handleViewTypeChange}
              title={formatMessage({
                id:
                  viewType === ViewType.LIST
                    ? 'app.layout.list-view'
                    : 'app.layout.tile-view'
              })}
            />
          )}
        </Toolbar>
        <Switch>
          <Redirect from="/" exact to="/dashboard" />
          <Route component={SuccessMessage} path="/account-created" />
          <Route
            component={LinkExpired}
            path="/confirmation-link-expired/:token?"
          />
          <Route component={ResetPassword} path="/reset-password" />
          <Route
            component={LinkExpired}
            path="/recovery-link-expired/:token?"
          />
          <Route
            component={PasswordRecoveryForm}
            path="/password-recovery/:token?"
          />
          <Route component={SuccessMessage} path="/password-recovery-success" />
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
          <Route component={UserProfile} path="/user-profile" />
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

  clearMetaDataSuccess: PropTypes.func.isRequired,
  getLoggedUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    { clearMetaDataSuccess, getLoggedUser }
  )
)(Layout);
