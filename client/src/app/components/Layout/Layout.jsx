import React, { PureComponent } from 'react';
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
  DeleteLinkExpired,
  LinkExpired,
  PasswordRecoveryForm,
  ResetPassword,
  SuccessMessage,
  UserProfile
} from 'modules/user';
import { getLoggedUser, removeUserData } from 'modules/user/model/actions';
import { UserPropType, IntlPropType } from 'common/constants/propTypes';
import { getCurrentUser } from 'modules/user/model/selectors';
import Footer from '../Footer';
import Notifications from 'modules/notification';
import Page404 from 'common/components/Page404';
import About from 'modules/about';
import {
  CookiePolicy,
  PrivacyPolicy,
  TermsOfUse
} from 'modules/privacy-policy';
import Cohorts from 'modules/cohort/components/Cohorts';
import Toolbar, { ToolbarItem } from './Toolbar';
import { ListViewIcon, TilesViewIcon } from 'assets/images/icons';
import { Routes, ViewType } from 'common/constants/enums';
import Preloader from 'common/components/Preloader';
import {
  loadSettingsData,
  saveSettingsData,
  storageKeys
} from 'common/utils/localStorage';
import { clearMetaDataSuccess } from 'common/model/actions';
import AccountDeleted from 'modules/user/UserProfile/AccountDeleted';
import Libraries from 'modules/libraries';
import CookieConsentBox from 'common/components/CookieConsentBox';
import { checkIfCookieSet } from 'common/utils/cookie';
import './Layout.scss';

export class Layout extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isCookieSet: true,
      pending: false,
      pendingForViewType: false,
      viewType: ViewType.LIST
    };
  }

  componentDidMount() {
    const settings = loadSettingsData();
    const {
      currentUser,
      getLoggedUser,
      history,
      location: { pathname }
    } = this.props;
    const isCookieSet = checkIfCookieSet('eoc_cookie-consent');

    this.setState({ isCookieSet });

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

    window.addEventListener('storage', this.handleStorageChanges);
  }

  componentDidUpdate(previousProps) {
    const {
      clearMetaDataSuccess,
      location: { pathname }
    } = this.props;
    const {
      location: { pathname: previousPathname }
    } = previousProps;

    if (previousPathname !== pathname) {
      clearMetaDataSuccess();
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.handleStorageChanges);
  }

  handleStorageChanges = ({ key }) => {
    const { removeUserData } = this.props;

    if (key === storageKeys.ACCOUNT) {
      removeUserData();
    }
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

  handleViewTypeChange = () => {
    const { viewType } = this.state;
    const newViewType =
      viewType === ViewType.LIST ? ViewType.TILES : ViewType.LIST;

    this.setState({ viewType: newViewType }, this.handleSaveSettings);
  };

  handleSaveSettings = () => {
    const { viewType } = this.state;
    const settings = { viewType };

    saveSettingsData(settings);
  };

  handleCookieAccept = () => this.setState({ isCookieSet: true });

  render() {
    const {
      currentUser,
      intl: { formatMessage },
      location: { pathname }
    } = this.props;
    const { isCookieSet, pending, pendingForViewType, viewType } = this.state;
    const isPolicyPage =
      pathname.includes('cookie-policy') ||
      pathname.includes('privacy-policy') ||
      pathname.includes('terms-of-use');
    const isDemoMode = currentUser && currentUser.name === 'Demo';
    const isBarVisible = isCookieSet || !(isDemoMode && isPolicyPage);

    if (pending) {
      return <Preloader />;
    }

    return (
      <>
        {!isCookieSet && (
          <CookieConsentBox
            isPolicyPage={isPolicyPage}
            onAccept={this.handleCookieAccept}
          />
        )}
        {!currentUser ? (
          <>
            <Notifications />
            <Switch>
              <Route component={AuthBox} exact path="/" />
              <Route component={PrivacyPolicy} path="/privacy-policy" />
              <Route component={TermsOfUse} path="/terms-of-use" />
              <Route component={CookiePolicy} path="/cookie-policy" />
              <Route component={SuccessMessage} path="/account-created" />
              <Route component={AccountDeleted} path="/account-deleted" />
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
              <Route
                component={DeleteLinkExpired}
                path="/delete-link-expired"
              />
              <Route
                component={SuccessMessage}
                path="/password-recovery-success"
              />
              <Redirect to="/" />
            </Switch>
          </>
        ) : (
          <>
            <Notifications />
            {isBarVisible && (
              <Toolbar isDemoMode={isDemoMode}>
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
                          ? 'app.layout.switch-to-tile-view'
                          : 'app.layout.switch-to-list-view'
                    })}
                  />
                )}
              </Toolbar>
            )}
            <Switch>
              <Redirect from="/" exact to="/dashboard" />
              <Route component={SuccessMessage} path="/account-created" />
              <Route component={AccountDeleted} path="/account-deleted" />
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
                component={DeleteLinkExpired}
                path="/delete-link-expired"
              />
              <Route
                component={PasswordRecoveryForm}
                path="/password-recovery/:token?"
              />
              <Route
                component={SuccessMessage}
                path="/password-recovery-success"
              />
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
              <Route component={TermsOfUse} path="/terms-of-use" />
              <Route component={CookiePolicy} path="/cookie-policy" />
              <Route component={Cohorts} path="/cohorts" />
              <Route component={UserProfile} path="/user-profile" />
              <Route component={Libraries} path="/libraries" />
              <Route component={Page404} />
            </Switch>
            {isBarVisible && <Footer />}
          </>
        )}
      </>
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
  getLoggedUser: PropTypes.func.isRequired,
  removeUserData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  withRouter,
  connect(mapStateToProps, {
    clearMetaDataSuccess,
    getLoggedUser,
    removeUserData
  })
)(Layout);
