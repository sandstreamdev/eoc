import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';

import Avatar from 'common/components/Avatar';
import { getCurrentUser } from 'modules/user/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';
import Preloader from 'common/components/Preloader';
import { fetchUserDetails } from 'modules/user/model/actions';

class UserProfile extends PureComponent {
  pendingPromise = null;

  state = {
    pending: false
  };

  componentDidMount() {
    this.handleFetchUserDetails();
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  handleFetchUserDetails = () => {
    const {
      currentUser: { name },
      fetchUserDetails
    } = this.props;

    this.setState({ pending: true });
    this.pendingPromise = makeAbortablePromise(fetchUserDetails(name));
    this.pendingPromise.promise
      .then(() => this.setState({ pending: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pending: false });
        }
      });
  };

  render() {
    const {
      currentUser: { activationDate, avatarUrl, email, name }
    } = this.props;
    const { pending } = this.state;

    return (
      <div className="wrapper">
        <article className="user-profile">
          <h1 className="user-profile__header">
            <span>
              <Avatar
                avatarUrl={avatarUrl}
                className="user-profile__header__avatar"
                name={name}
              />
            </span>
            {name}
          </h1>
          <section className="user-profile__data-container">
            <h2 className="user-profile__data-header">
              <FormattedMessage id="authorization.user-profile.personal-info" />
            </h2>
            <ul className="user-profile__data-list">
              <li className="user-profile__data-item  user-profile__photo">
                <span className="user-profile__data-name">
                  <FormattedMessage id="authorization.photo" />
                </span>
                <span className="user-profile__data-value">
                  <Avatar
                    avatarUrl={avatarUrl}
                    className="user-profile__avatar"
                    name={name}
                  />
                </span>
              </li>
              <li className="user-profile__data-item">
                <span className="user-profile__data-name">
                  <FormattedMessage id="authorization.name" />
                </span>
                <span className="user-profile__data-value">{name}</span>
              </li>
            </ul>
          </section>
          <section className="user-profile__data-container">
            <h2 className="user-profile__data-header">
              <FormattedMessage id="authorization.user-profile.contact-info" />
            </h2>
            <ul className="user-profile__data-list">
              <li className="user-profile__data-item">
                <span className="user-profile__data-name">
                  <FormattedMessage id="authorization.email" />
                </span>
                <span className="user-profile__data-value">{email}</span>
              </li>
            </ul>
          </section>
          <section className="user-profile__data-container">
            <h2 className="user-profile__data-header">
              <FormattedMessage id="authorization.user-profile.account" />
            </h2>
            <ul className="user-profile__data-list">
              <li className="user-profile__data-item">
                <span className="user-profile__data-name">
                  <FormattedMessage id="authorization.user-profile.account-activation" />
                </span>
                <span className="user-profile__data-value">
                  {activationDate && (
                    <Fragment>
                      <FormattedDate
                        value={activationDate}
                        year="numeric"
                        month="long"
                        day="2-digit"
                      />
                      {' at '}
                      <FormattedTime value={activationDate} />
                    </Fragment>
                  )}
                </span>
              </li>
            </ul>
          </section>
          {pending && <Preloader />}
        </article>
      </div>
    );
  }
}

UserProfile.propTypes = {
  currentUser: UserPropType.isRequired,

  fetchUserDetails: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  { fetchUserDetails }
)(UserProfile);
