import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import { CloseIcon, InfoIcon, UserIcon } from 'assets/images/icons';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import {
  addOwnerRole as addOwnerRoleInCohort,
  removeCohortMember,
  removeOwnerRole as removeOwnerRoleInCohort
} from 'modules/cohort/model/actions';
import {
  addOwnerRole as addOwnerRoleInList,
  removeOwnerRole as removeOwnerRoleInList,
  addMemberRole as addMemberRoleInList,
  removeMemberRole as removeMemberRoleInList,
  removeListMember
} from 'modules/list/model/actions';
import { Routes, UserRoles, UserRolesToDisplay } from 'common/constants/enums';
import Preloader from 'common/components/Preloader';
import SwitchButton from 'common/components/SwitchButton';

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

    this.state = {
      isConfirmationVisible: false,
      isMemberInfoVisible: false,
      isOwnerInfoVisible: false,
      pending: false
    };
  }

  handleConfirmationVisibility = () =>
    this.setState(({ isConfirmationVisible }) => ({
      isConfirmationVisible: !isConfirmationVisible
    }));

  handleMemberRemoving = () => {
    const {
      isOwner,
      match: {
        params: { id }
      },
      removeCohortMember,
      removeListMember,
      route,
      _id: userId
    } = this.props;

    const action =
      route === Routes.COHORT ? removeCohortMember : removeListMember;

    this.setState({ pending: true });

    action(id, userId, isOwner).catch(() => this.setState({ pending: false }));
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

  changeCohortRole = () => {
    const {
      _id: userId,
      addOwnerRoleInCohort,
      isOwner,
      match: {
        params: { id }
      },
      removeOwnerRoleInCohort
    } = this.props;

    this.setState({ pending: true });

    const action = isOwner ? removeOwnerRoleInCohort : addOwnerRoleInCohort;

    action(id, userId).finally(() => this.setState({ pending: false }));
  };

  changeListRole = selectedRole => {
    const {
      addMemberRoleInList,
      addOwnerRoleInList,
      removeMemberRoleInList,
      removeOwnerRoleInList,
      match: {
        params: { id }
      },
      _id: userId,
      isMember,
      isOwner
    } = this.props;
    let action;

    this.setState({ pending: true });

    switch (selectedRole) {
      case UserRoles.OWNER:
        action = isOwner ? removeOwnerRoleInList : addOwnerRoleInList;
        break;
      case UserRoles.MEMBER:
        action = isMember ? removeMemberRoleInList : addMemberRoleInList;
        break;
      default:
        break;
    }

    action(id, userId).finally(() => this.setState({ pending: false }));
  };

  handleChangingRoles = event => {
    event.stopPropagation();
    const {
      target: { value: selectedRole }
    } = event;
    const { route } = this.props;

    switch (route) {
      case Routes.COHORT:
        this.changeCohortRole();
        break;
      case Routes.LIST:
        this.changeListRole(selectedRole);
        break;
      default:
        break;
    }
  };

  renderChangeRoleOption = (role, isInfoVisible, checked) => {
    const { route } = this.props;
    const label = role === UserRoles.OWNER ? 'owner' : 'member';
    const disabled = route === Routes.COHORT && role === UserRoles.MEMBER;

    return (
      <Fragment>
        <div className="member-details__option-header">
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
          <SwitchButton
            checked={checked}
            disabled={disabled}
            label={label}
            onChange={disabled ? null : this.handleChangingRoles}
            value={role}
          />
        </div>
        {isInfoVisible && (
          <p className="member-details__role-description">
            {infoText[route][role]}
          </p>
        )}
      </Fragment>
    );
  };

  renderRemoveOption = () => {
    const { isConfirmationVisible } = this.state;
    const { displayName } = this.props;

    return isConfirmationVisible ? (
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

  renderHeader = () => {
    const {
      displayName,
      isMember,
      isOwner,
      isGuest,
      isCohortList
    } = this.props;
    let roleToDisplay = UserRolesToDisplay.VIEWER;

    if (isMember) {
      roleToDisplay = UserRolesToDisplay.MEMBER;
    }

    if (isOwner) {
      roleToDisplay = UserRolesToDisplay.OWNER;
    }

    return (
      <header className="member-details__header">
        <div className="member-details__avatar">{this.renderAvatar()}</div>
        <div>
          <h3 className="member-details__name">{displayName}</h3>
          <p className="member-details__role">
            {roleToDisplay}
            {isGuest && isCohortList && '\n(Guest)'}
          </p>
        </div>
      </header>
    );
  };

  renderDetails = () => {
    const { isMemberInfoVisible, isOwnerInfoVisible, pending } = this.state;
    const {
      isGuest,
      isMember,
      isOwner,
      isPrivate: privateList,
      route
    } = this.props;

    if (pending) {
      return (
        <div className="member-details__preloader">
          <Preloader />
        </div>
      );
    }

    return (
      <ul className="member-details__panel">
        <li className="member-details__option">
          {this.renderChangeRoleOption(
            UserRoles.OWNER,
            isOwnerInfoVisible,
            isOwner
          )}
        </li>
        <li className="member-details__option">
          {this.renderChangeRoleOption(
            UserRoles.MEMBER,
            isMemberInfoVisible,
            isMember
          )}
        </li>
        {(route === Routes.COHORT || privateList || isGuest) && (
          <li className="member-details__option member-details__option--removing">
            {this.renderRemoveOption()}
          </li>
        )}
      </ul>
    );
  };

  renderMessage = () => (
    <p className="member-details__notice">
      You cannot edit your own settings here.
    </p>
  );

  render() {
    const {
      _id: userId,
      currentUser: { id: currentUserId },
      isCurrentUserAnOwner,
      onClose
    } = this.props;

    return (
      <Fragment>
        <div
          className={classNames('member-details', {
            'member-details--flexible': !isCurrentUserAnOwner,
            'member-details--mobile': window.outerWidth < 400
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
            {this.renderHeader()}
            {isCurrentUserAnOwner &&
              userId !== currentUserId &&
              this.renderDetails()}
            {isCurrentUserAnOwner &&
              userId === currentUserId &&
              this.renderMessage()}
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
  isCohortList: PropTypes.bool,
  isCurrentUserAnOwner: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool,
  isMember: PropTypes.bool,
  isOwner: PropTypes.bool,
  isPrivate: PropTypes.bool,
  match: RouterMatchPropType.isRequired,
  route: PropTypes.string,

  addMemberRoleInList: PropTypes.func.isRequired,
  addOwnerRoleInCohort: PropTypes.func.isRequired,
  addOwnerRoleInList: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  removeCohortMember: PropTypes.func.isRequired,
  removeListMember: PropTypes.func.isRequired,
  removeMemberRoleInList: PropTypes.func.isRequired,
  removeOwnerRoleInList: PropTypes.func.isRequired,
  removeOwnerRoleInCohort: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      addMemberRoleInList,
      addOwnerRoleInCohort,
      addOwnerRoleInList,
      removeCohortMember,
      removeListMember,
      removeMemberRoleInList,
      removeOwnerRoleInCohort,
      removeOwnerRoleInList
    }
  )(MemberDetails)
);
