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
      role: isOwner ? UserRoles.OWNER : UserRoles.MEMBER
    };
  }

  handleConfirmationVisibility = () => {
    this.setState(({ isConfirmVisible }) => ({
      isConfirmVisible: !isConfirmVisible
    }));
  };

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

  handleOwnerInfoVisibility = e => {
    e.stopPropagation();
    this.setState(({ isOwnerInfoVisible }) => ({
      isOwnerInfoVisible: !isOwnerInfoVisible
    }));
  };

  handleMemberInfoVisibility = e => {
    e.stopPropagation();
    this.setState(({ isMemberInfoVisible }) => ({
      isMemberInfoVisible: !isMemberInfoVisible
    }));
  };

  handleChangingPermissions = e => {
    e.stopPropagation();
    const { route } = this.props;
    switch (route) {
      case Routes.COHORT:
        this.handleCohortMemberRoleChange(e.target.value);
        break;
      case Routes.LIST:
        this.handleListMemberRoleChange(e.target.value);
        break;
      default:
        break;
    }
  };

  handleCohortMemberRoleChange = role => {
    const {
      changeRoleInCohort,
      match: {
        params: { id }
      },
      _id: userId
    } = this.props;

    changeRoleInCohort(id, userId, role)
      .then(this.setState({ role }))
      .catch(noOp);
  };

  handleListMemberRoleChange = role => {
    const {
      changeRoleInList,
      match: {
        params: { id }
      },
      _id: userId
    } = this.props;

    changeRoleInList(id, userId, role)
      .then(this.setState({ role }))
      .catch(noOp);
  };

  render() {
    const {
      isConfirmVisible,
      isOwnerInfoVisible,
      isMemberInfoVisible,
      role
    } = this.state;
    const {
      _id: userId,
      avatarUrl,
      currentUser: { id: currentUserId },
      displayName,
      isCurrentOwner,
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
            type="button"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
          <div className="member-details__details">
            <div className="member-details__heading">
              <div className="member-details__avatar">
                {avatarUrl ? (
                  <img
                    alt={`${displayName} avatar`}
                    className="member-details__image"
                    src={avatarUrl}
                  />
                ) : (
                  <UserIcon />
                )}
              </div>
              <div>
                <h3 className="member-details__name">{displayName}</h3>
                <p className="member-details__role">
                  {`${role === UserRoles.OWNER ? 'owner' : 'member'}`}
                </p>
              </div>
            </div>
            {isCurrentOwner && userId !== currentUserId && (
              <Fragment>
                <ul className="member-details__panel">
                  <li className="member-details__option">
                    <label htmlFor="ownerRole">Change to owner</label>
                    <span>
                      <button
                        className="member-details__info-button"
                        onClick={this.handleOwnerInfoVisibility}
                        type="button"
                      >
                        <span>
                          <InfoIcon />
                        </span>
                      </button>
                      <input
                        checked={role === UserRoles.OWNER}
                        id="ownerRole"
                        name="role"
                        onChange={this.handleChangingPermissions}
                        type="radio"
                        value={UserRoles.OWNER}
                      />
                    </span>
                    {isOwnerInfoVisible && (
                      <p className="member-details__role-description">
                        {infoText[route][UserRoles.OWNER]}
                      </p>
                    )}
                  </li>
                  <li className="member-details__option">
                    <label htmlFor="memberRole">Change to member</label>
                    <span>
                      <button
                        className="member-details__info-button"
                        onClick={this.handleMemberInfoVisibility}
                        type="button"
                      >
                        <span>
                          <InfoIcon />
                        </span>
                      </button>
                      <input
                        checked={role === UserRoles.MEMBER}
                        id="memberRole"
                        name="role"
                        onChange={this.handleChangingPermissions}
                        type="radio"
                        value={UserRoles.MEMBER}
                      />
                    </span>
                    {isMemberInfoVisible && (
                      <p className="member-details__role-description">
                        {infoText[route][UserRoles.MEMBER]}
                      </p>
                    )}
                  </li>
                  <li className="member-details__option">
                    {isConfirmVisible ? (
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
                    )}
                  </li>
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
  isOwner: PropTypes.bool,
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
