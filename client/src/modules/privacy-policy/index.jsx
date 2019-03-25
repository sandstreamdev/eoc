/* eslint-disable react/jsx-one-expression-per-line */
import React, { Fragment, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import { checkIfCookieSet } from 'common/utils/cookie';
import CookieConsentBox from 'common/components/CookieConsentBox';
import Toolbar from 'common/components/Toolbar';

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
        {currentUser && <Toolbar />}
        <div className="privacy-policy">
          <h1 className="privacy-policy__intro-heading">
            Privacy &&nbsp;Terms
          </h1>
          <h2 className="privacy-policy__intro-subheading">
            Check our Privacy Policy and&nbsp;Terms.
          </h2>
          <div className="privacy-policy__info-wrapper">
            <div className="privacy-policy__info">
              <h2 className="privacy-policy__header">Privacy Policy</h2>
              <p className="privacy-policy__content">
                Sandstream Development (herein referred to as “Sandstream”) has
                created this Privacy Policy in line with our commitment to your
                privacy on EOC Application (herein referred to &apos;App&apos;).
                This app informs you of our policies regarding the collection,
                use and disclosure of Personal Information, Information Security
                and Quality, and Cookies.
              </p>
            </div>
          </div>
          <div className="privacy-policy__info-wrapper">
            <div className="privacy-policy__info">
              <h2 className="privacy-policy__header">Personal Information</h2>
              <p className="privacy-policy__content">
                Our privacy practices are designed to provide a high level of
                protection for your personal data. We use your Personal
                information only for providing and improving the App. You agree
                to the collection and use of this information in accordance with
                this policy.
              </p>
            </div>
          </div>
          <div className="privacy-policy__info-wrapper">
            <div className="privacy-policy__info">
              <h2 className="privacy-policy__header">
                Information Security and&nbsp;Quality
              </h2>
              <p className="privacy-policy__content">
                The security of your Personal Information is important to us. We
                intend to protect the quality and integrity of your personally
                identifiable information. We will make a sincere effort to
                respond in a timely manner to your requests to correct
                inaccuracies in your personal information. To correct
                inaccuracies in your personal information, please send the
                message containing the inaccuracies to the author with details
                of the correction requested.
              </p>
            </div>
          </div>
          <div className="privacy-policy__info-wrapper">
            <div className="privacy-policy__info">
              <h2 className="privacy-policy__header">Cookies</h2>
              <p className="privacy-policy__content">
                Like many site operators, we collect information (i.e. cookies)
                that your browser sends whenever you visit the App. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent. However, if you do not accept cookies,
                you may not be able to use our App.
              </p>
            </div>
          </div>
          <div className="privacy-policy__info-wrapper">
            <div className="privacy-policy__info">
              <h2 className="privacy-policy__header">Business Connections</h2>
              <p className="privacy-policy__content">
                This web application may contain links to various third-party
                websites. Sandstream has no control over and is not responsible
                for the content, privacy policies or reliability of such sites.
              </p>
            </div>
          </div>
          <div className="privacy-policy__info-wrapper">
            <div className="privacy-policy__info">
              <h2 className="privacy-policy__header">Contact Us</h2>
              <p className="privacy-policy__content">
                If you have any questions about this Privacy Policy or
                practices, please contact us via a{' '}
                <a
                  href="https://sandstream.pl/contact"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  contact form
                </a>
                .
              </p>
            </div>
          </div>
          <div className="privacy-policy__info-wrapper">
            <div className="privacy-policy__info">
              <h2 className="privacy-policy__header">
                Changes to this Privacy Policy
              </h2>
              <p className="privacy-policy__content">
                Sandstream reserves the right to change, modify or otherwise
                update this Privacy Statement at any time. So we encourage you
                to review this privacy statement periodically to track the
                changes.
              </p>
            </div>
          </div>
          {!currentUser && (
            <div className="privacy-policy__links">
              <Link className="primary-button" to="/">
                Login page
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
