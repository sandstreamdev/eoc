import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import { CloseIcon, HelpIcon, UserIcon } from 'assets/images/icons';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import {
  removeCohortUser,
  setAsCohortMember,
  setAsCohortOwner
} from 'modules/members/model/actions';

const MemberDetailsContext = Object.freeze({
  REMOVE: 'memberDialog/REMOVE',
  MEMBER: 'memberDialog/MEMBER',
  OWNER: 'memberDialog/OWNER'
});

class MemberDetails extends PureComponent {
  constructor(props) {
    super(props);
    const { isOwner } = props;
    this.state = {
      isConfirmVisible: false,
      isMemberHelpVisible: false,
      isOwnerHelpVisible: false,
      isOwner
    };
  }

  handleConfirmationVisibility = () => {
    const { isConfirmVisible } = this.state;
    this.setState({ isConfirmVisible: !isConfirmVisible });
  };

  handleUserRemoving = () => {
    const {
      isOwner,
      match: {
        params: { id }
      },
      onClose,
      removeCohortUser,
      _id: userId
    } = this.props;
    removeCohortUser(id, userId, isOwner);
    onClose();
  };

  handleOwnerHelpVisibility = e => {
    e.stopPropagation();
    const { isOwnerHelpVisible } = this.state;
    this.setState({ isOwnerHelpVisible: !isOwnerHelpVisible });
  };

  handleMemberHelpVisibility = e => {
    e.stopPropagation();
    const { isMemberHelpVisible } = this.state;
    this.setState({ isMemberHelpVisible: !isMemberHelpVisible });
  };

  handleChangingRoles = e => {
    e.stopPropagation();
    const { isOwner } = this.state;
    const {
      match: {
        params: { id }
      },
      setAsCohortMember,
      setAsCohortOwner,
      _id: userId
    } = this.props;
    this.setState({ isOwner: !isOwner });
    switch (e.target.value) {
      case MemberDetailsContext.OWNER:
        setAsCohortOwner(id, userId);
        break;
      case MemberDetailsContext.MEMBER:
        setAsCohortMember(id, userId);
        break;
      default:
        break;
    }
  };

  render() {
    const {
      isConfirmVisible,
      isOwner,
      isOwnerHelpVisible,
      isMemberHelpVisible
    } = this.state;
    const {
      currentUser: { id: currentUserId },
      _id: userId,
      isCurrentOwner,
      avatarUrl,
      onClose,
      displayName
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
                  {`${isOwner ? 'owner' : 'member'}`}
                </p>
              </div>
            </div>
            {isCurrentOwner && userId !== currentUserId && (
              <Fragment>
                <ul className="member-details__panel">
                  <li className="member-details__option">
                    <label htmlFor="ownerRole">Set as a owner</label>
                    <span>
                      <button
                        className="member-details__help-button"
                        onClick={this.handleOwnerHelpVisibility}
                        type="button"
                      >
                        <HelpIcon />
                      </button>
                      <input
                        checked={isOwner}
                        id="ownerRole"
                        name="role"
                        onChange={this.handleChangingRoles}
                        type="radio"
                        value={MemberDetailsContext.OWNER}
                      />
                    </span>
                    {isOwnerHelpVisible && (
                      <p className="member-details__role-description">
                        {'Can edit, archive and delete this cohort. '}
                        {"Can add, edit list's items and mark them as done. "}
                        {'Can add, edit, archive and delete lists. '}
                        {'Can add, remove members, and change their roles. '}
                      </p>
                    )}
                  </li>
                  <li className="member-details__option">
                    <label htmlFor="memberRole">Set as a member</label>
                    <span>
                      <button
                        className="member-details__help-button"
                        onClick={this.handleMemberHelpVisibility}
                        type="button"
                      >
                        <HelpIcon />
                      </button>
                      <input
                        checked={!isOwner}
                        id="memberRole"
                        name="role"
                        onChange={this.handleChangingRoles}
                        type="radio"
                        value={MemberDetailsContext.MEMBER}
                      />
                    </span>
                    {isMemberHelpVisible && (
                      <p className="member-details__role-description">
                        {"Can view lists, add and edit list's items."}
                      </p>
                    )}
                  </li>
                  <li className="member-details__option">
                    {isConfirmVisible ? (
                      <div className="member-details__confirmation">
                        <h4>{`Do you really want to remove ${displayName}?`}</h4>
                        <button
                          className="primary-button"
                          onClick={this.handleUserRemoving}
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
  avatarUrl: PropTypes.string,
  currentUser: UserPropType.isRequired,
  isCurrentOwner: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool,
  displayName: PropTypes.string.isRequired,
  match: RouterMatchPropType.isRequired,
  _id: PropTypes.string.isRequired,

  onClose: PropTypes.func.isRequired,
  removeCohortUser: PropTypes.func.isRequired,
  setAsCohortMember: PropTypes.func.isRequired,
  setAsCohortOwner: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    { removeCohortUser, setAsCohortMember, setAsCohortOwner }
  )(MemberDetails)
);
