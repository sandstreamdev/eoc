import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { RouterMatchPropType } from 'common/constants/propTypes';
import { CloseIcon, HelpIcon, UserIcon } from 'assets/images/icons';
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

class MemberBox extends PureComponent {
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

  handleUserRemovingConfirm = () => {
    const {
      isOwner,
      match: {
        params: { id }
      },
      removeCohortUser,
      userId
    } = this.props;
    removeCohortUser(id, userId, isOwner);
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
      userId
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
    const { isCurrentOwner, avatarUrl, onClose, name } = this.props;

    return (
      <Fragment>
        <div className="member-box">
          <button className="member-box__close" type="button" onClick={onClose}>
            <CloseIcon />
          </button>
          <div className="member-box__details">
            <div className="member-box__heading">
              <div className="member-box__avatar">
                {avatarUrl ? (
                  <img
                    alt={`${name} avatar`}
                    className="member-box__image"
                    src={avatarUrl}
                  />
                ) : (
                  <UserIcon />
                )}
              </div>
              <h3 className="member-box__name">
                {name}
                <span className="member-box__role">
                  {` - ${isOwner ? 'owner' : 'member'}`}
                </span>
              </h3>
            </div>
            {isCurrentOwner && (
              <ul className="member-box__panel">
                <li className="member-box__option">
                  <label htmlFor="ownerRole">Set as a owner</label>
                  <span>
                    <button
                      className="member-box__help-button"
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
                    <p className="member-box__role-description">
                      {'Can edit, archive and delete this cohort. '}
                      {"Can add, edit list's items and mark them as done. "}
                      {'Can add, edit, archive and delete lists. '}
                      {'Can add, remove members, and change their roles. '}
                    </p>
                  )}
                </li>
                <li className="member-box__option">
                  <label htmlFor="memberRole">Set as a member</label>
                  <span>
                    <button
                      className="member-box__help-button"
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
                    <p className="member-box__role-description">
                      {"Can view lists, add and edit list's items."}
                    </p>
                  )}
                </li>
                <li className="member-box__option">
                  {isConfirmVisible ? (
                    <div className="member-box__confirmation">
                      <h4>{`Do you really want to remove ${name}?`}</h4>
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
                      className="member-box__button primary-button"
                      onClick={this.handleConfirmationVisibility}
                      type="button"
                    >
                      Remove user
                    </button>
                  )}
                </li>
              </ul>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

MemberBox.propTypes = {
  avatarUrl: PropTypes.string,
  isCurrentOwner: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool,
  name: PropTypes.string.isRequired,
  match: RouterMatchPropType.isRequired,
  userId: PropTypes.string.isRequired,

  onClose: PropTypes.func.isRequired,
  removeCohortUser: PropTypes.func.isRequired,
  setAsCohortMember: PropTypes.func.isRequired,
  setAsCohortOwner: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { removeCohortUser, setAsCohortMember, setAsCohortOwner }
  )(MemberBox)
);
