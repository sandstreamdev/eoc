import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import { CloseIcon, InfoIcon, UserIcon } from 'assets/images/icons';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import {
  changeRole as changeRoleInCohort,
  removeCohortMember
} from 'modules/cohort/model/actions';
import {
  changeRole as changeRoleInList,
  removeListMember
} from 'modules/list/model/actions';
import { Routes, UserRoles } from 'common/constants/enums';
import { noOp } from 'common/utils/noOp';

const infoText = {
  [Routes.COHORT]: {
    [UserRoles.OWNER]:
      "Can edit, archive and delete this cohort. Can add, edit list's items and mark them as done. Can add, edit, archive and delete lists. Can add, remove members, and change their roles.",
    [UserRoles.MEMBER]: "Can view lists, add and edit list's items."
  },
  [Routes.LIST]: {
    [UserRoles.OWNER]:
      "Can edit, archive and delete this list. Can add, edit list's items and mark them as done. Can add, remove members, and change their roles.",
    [UserRoles.MEMBER]: "Can view, add and edit list's items."
  }
};

class MemberDetails extends PureComponent {
  constructor(props) {
    super(props);
    const { isOwner } = props;

    this.state = {
      isConfirmVisible: false,
      isMemberInfoVisible: false,
      isOwnerInfoVisible: false,
      checkedRole: isOwner ? UserRoles.OWNER : UserRoles.MEMBER
    };
  }

  handleConfirmationVisibility = () =>
    this.setState(({ isConfirmVisible }) => ({
      isConfirmVisible: !isConfirmVisible
    }));

  handleMemberRemoving = () => {
    const {
      isOwner,
      match: {
        params: { id }
      },
      onClose,
      removeCohortMember,
      removeListMember,
      route,
      _id: userId
    } = this.props;

    switch (route) {
      case Routes.COHORT:
        removeCohortMember(id, userId, isOwner);
        break;
      case Routes.LIST:
        removeListMember(id, userId, isOwner);
        break;
      default:
        break;
    }

    onClose();
  };

  handleOwnerInfoVisibility = event => {
    event.stopPropagation();
    this.setState(({ isOwnerInfoVisible }) => ({
      isOwnerInfoVisible: !isOwnerInfoVisible
    }));
  };

  handleMemberInfoVisibility = event => {
    event.stopPropagation();
    this.setState(({ isMemberInfoVisible }) => ({
      isMemberInfoVisible: !isMemberInfoVisible
    }));
  };

  handleChangingPermissions = event => {
    event.stopPropagation();
    const {
      target: { value }
    } = event;
    const { route } = this.props;

    switch (route) {
      case Routes.COHORT:
        this.handleCohortMemberRoleChange(value);
        break;
      case Routes.LIST:
        this.handleListMemberRoleChange(value);
        break;
      default:
        break;
    }
  };

  handleCohortMemberRoleChange = checkedRole => {
    const {
      changeRoleInCohort,
      match: {
        params: { id }
      },
      _id: userId
    } = this.props;

    changeRoleInCohort(id, userId, checkedRole)
      .then(this.setState({ checkedRole }))
      .catch(noOp);
  };

  handleListMemberRoleChange = checkedRole => {
    const {
      changeRoleInList,
      match: {
        params: { id }
      },
      _id: userId
    } = this.props;

    changeRoleInList(id, userId, checkedRole)
      .then(this.setState({ checkedRole }))
      .catch(noOp);
  };

  renderChangeRoleOption = (role, isInfoVisible) => {
    const { checkedRole } = this.state;
    const { route } = this.props;

    const label = role === UserRoles.OWNER ? 'owner' : 'member';

    return (
      <Fragment>
        <label htmlFor={`${label}Role`}>{`Change to ${label}`}</label>
        <span>
          <button
            className="member-details__info-button"
            onClick={
              role === UserRoles.OWNER
                ? this.handleOwnerInfoVisibility
                : this.handleMemberInfoVisibility
            }
            type="button"
          >
            <span>
              <InfoIcon />
            </span>
          </button>
          <input
            checked={checkedRole === role}
            id={`${label}Role`}
            name="role"
            onChange={this.handleChangingPermissions}
            type="radio"
            value={role}
          />
        </span>
        {isInfoVisible && (
          <p className="member-details__role-description">
            {infoText[route][role]}
          </p>
        )}
      </Fragment>
    );
  };

  renderRemoveOption = () => {
    const { isConfirmVisible } = this.state;
    const { displayName } = this.props;

    return isConfirmVisible ? (
      <div className="member-details__confirmation">
        <h4>{`Do you really want to remove ${displayName}?`}</h4>
        <button
          className="primary-button"
          onClick={this.handleMemberRemoving}
          type="button"
        >
          Confirm
        </button>
        <button
          className="primary-button"
          onClick={this.handleConfirmationVisibility}
          type="button"
        >
          Cancel
        </button>
      </div>
    ) : (
      <button
        className="member-details__button primary-button"
        onClick={this.handleConfirmationVisibility}
        type="button"
      >
        Remove user
      </button>
    );
  };

  renderAvatar = () => {
    const { avatarUrl, displayName } = this.props;

    return avatarUrl ? (
      <img
        alt={`${displayName} avatar`}
        className="member-details__image"
        src={avatarUrl}
      />
    ) : (
      <UserIcon />
    );
  };

  renderHeading = () => {
    const { role } = this.state;
    const { displayName } = this.props;

    return (
      <Fragment>
        <div className="member-details__avatar">{this.renderAvatar()}</div>
        <div>
          <h3 className="member-details__name">{displayName}</h3>
          <p className="member-details__role">
            {`${role === UserRoles.OWNER ? 'owner' : 'member'}`}
          </p>
        </div>
      </Fragment>
    );
  };

  render() {
    const { isMemberInfoVisible, isOwnerInfoVisible } = this.state;
    const {
      _id: userId,
      currentUser: { id: currentUserId },
      isCurrentOwner,
      isGuest,
      isPrivate: privateList,
      onClose,
      route
    } = this.props;

    return (
      <Fragment>
        <div
          className={classNames('member-details', {
            'member-details--flexible': !isCurrentOwner
          })}
        >
          <button
            className="member-details__close"
            onClick={onClose}
            type="button"
          >
            <CloseIcon />
          </button>
          <div className="member-details__details">
            <header className="member-details__heading">
              {this.renderHeading()}
            </header>
            {isCurrentOwner && userId !== currentUserId && (
              <Fragment>
                <ul className="member-details__panel">
                  <li className="member-details__option">
                    {this.renderChangeRoleOption(
                      UserRoles.OWNER,
                      isOwnerInfoVisible
                    )}
                  </li>
                  <li className="member-details__option">
                    {this.renderChangeRoleOption(
                      UserRoles.MEMBER,
                      isMemberInfoVisible
                    )}
                  </li>
                  {(route === Routes.COHORT || privateList || isGuest) && (
                    <li className="member-details__option member-details__option--removing">
                      {this.renderRemoveOption()}
                    </li>
                  )}
                </ul>
              </Fragment>
            )}
            {isCurrentOwner && userId === currentUserId && (
              <p className="member-details__notice">
                You cannot edit your own settings here.
              </p>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

MemberDetails.propTypes = {
  _id: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  currentUser: UserPropType.isRequired,
  displayName: PropTypes.string.isRequired,
  isCurrentOwner: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool,
  isOwner: PropTypes.bool,
  isPrivate: PropTypes.bool,
  match: RouterMatchPropType.isRequired,
  route: PropTypes.string,

  changeRoleInCohort: PropTypes.func.isRequired,
  changeRoleInList: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  removeCohortMember: PropTypes.func.isRequired,
  removeListMember: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      changeRoleInCohort,
      changeRoleInList,
      removeCohortMember,
      removeListMember
    }
  )(MemberDetails)
);
