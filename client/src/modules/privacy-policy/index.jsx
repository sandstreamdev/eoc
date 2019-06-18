/* eslint-disable react/jsx-one-expression-per-line */
import React, { Fragment, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import { checkIfCookieSet } from 'common/utils/cookie';
import CookieConsentBox from 'common/components/CookieConsentBox';

class PrivacyPolicy extends PureComponent {
  state = {
    isCookieSet: false
  };

  componentDidMount() {
    const isCookieSet = checkIfCookieSet('eoc_cookie-consent');
    this.setState({ isCookieSet });
  }

  handleCookieAccept = () => this.setState({ isCookieSet: true });

  render() {
    const { isCookieSet } = this.state;
    const { currentUser } = this.props;

    return (
      <Fragment>
        <div className="privacy-policy">
          <h1 className="privacy-policy__intro-heading">
            <FormattedMessage id="privacy-policy.index.heading" />
          </h1>
          <h2 className="privacy-policy__intro-subheading">
            <FormattedMessage id="privacy-policy.index.subheading" />
          </h2>
          <div className="privacy-policy__info-wrapper">
            <article className="privacy-policy__info">
              <h2 className="privacy-policy__header">
                <FormattedMessage id="privacy-policy.index.privacy-policy" />
              </h2>
              <p className="privacy-policy__content">
                <FormattedMessage id="privacy-policy.index.content-1" />
              </p>
            </article>
          </div>
          <div className="privacy-policy__info-wrapper">
            <article className="privacy-policy__info">
              <h2 className="privacy-policy__header">
                <FormattedMessage id="privacy-policy.index.header-1" />
              </h2>
              <p className="privacy-policy__content">
                <FormattedMessage id="privacy-policy.index.content-2" />
              </p>
            </article>
          </div>
          <div className="privacy-policy__info-wrapper">
            <article className="privacy-policy__info">
              <h2 className="privacy-policy__header">
                <FormattedMessage id="privacy-policy.index.header-2" />
              </h2>
              <p className="privacy-policy__content">
                <FormattedMessage id="privacy-policy.index.content-3" />
              </p>
            </article>
          </div>
          <div className="privacy-policy__info-wrapper">
            <article className="privacy-policy__info">
              <h2 className="privacy-policy__header">
                <FormattedMessage id="privacy-policy.index.header-3" />
              </h2>
              <p className="privacy-policy__content">
                <FormattedMessage id="privacy-policy.index.content-4" />
              </p>
            </article>
          </div>
          <div className="privacy-policy__info-wrapper">
            <article className="privacy-policy__info">
              <h2 className="privacy-policy__header">
                <FormattedMessage id="privacy-policy.index.header-4" />
              </h2>
              <p className="privacy-policy__content">
                <FormattedMessage id="privacy-policy.index.content-5" />
              </p>
            </article>
          </div>
          <div className="privacy-policy__info-wrapper">
            <article className="privacy-policy__info">
              <h2 className="privacy-policy__header">
                <FormattedMessage id="privacy-policy.index.header-5" />
              </h2>
              <p className="privacy-policy__content">
                <FormattedMessage id="privacy-policy.index.content-6" />
                <a
                  href="https://sandstream.pl/contact"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FormattedMessage id="privacy-policy.index.link" />
                </a>
              </p>
            </article>
          </div>
          <div className="privacy-policy__info-wrapper">
            <article className="privacy-policy__info">
              <h2 className="privacy-policy__header">
                <FormattedMessage id="privacy-policy.index.header-6" />
              </h2>
              <p className="privacy-policy__content">
                <FormattedMessage id="privacy-policy.index.content-7" />
              </p>
            </article>
          </div>
          {!currentUser && (
            <div className="privacy-policy__links">
              <Link to="/">
                <button className="primary-button" type="button">
                  <FormattedMessage id="privacy-policy.index.login-btn" />
                </button>
              </Link>
            </div>
          )}
        </div>
        {!isCookieSet && !currentUser && (
          <CookieConsentBox onAccept={this.handleCookieAccept} />
        )}
      </Fragment>
    );
  }
}
PrivacyPolicy.propTypes = { currentUser: UserPropType };

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(mapStateToProps)(PrivacyPolicy);
