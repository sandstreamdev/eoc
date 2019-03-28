import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { RouterMatchPropType } from 'common/constants/propTypes';
import { UserIcon } from 'assets/images/icons';
import {
  removeCohortUser,
  setAsCohortMember,
  setAsCohortOwner
} from 'modules/members/model/actions';
import Dialog from 'common/components/Dialog';

const MemberDialogContext = Object.freeze({
  REMOVE: 'memberDialog/REMOVE',
  SET_MEMBER: 'memberDialog/MEMBER',
  SET_OWNER: 'memberDialog/OWNER'
});

class MemberBox extends PureComponent {
  state = {
    areDetailsVisible: false,
    dialogContext: '',
    dialogTitle: ''
  };

  handleDetailsVisibility = () => {
    const { areDetailsVisible } = this.state;
    this.setState({ areDetailsVisible: !areDetailsVisible });
  };

  handleDialogContext = context => () => {
    const { name } = this.props;
    let dialogTitle = '';
    switch (context) {
      case MemberDialogContext.REMOVE:
        dialogTitle = `Do you really want to remove ${name}?`;
        break;
      case MemberDialogContext.SET_MEMBER:
        dialogTitle = `Do you really want to set ${name} as member?`;
        break;
      case MemberDialogContext.SET_OWNER:
        dialogTitle = `Do you really want to set ${name} as a owner?`;
        break;
      default:
        break;
    }
    this.setState({ dialogContext: context, dialogTitle });
  };

  handleConfirm = () => {
    const { dialogContext } = this.state;
    const {
      isOwner,
      match: {
        params: { id }
      },
      removeCohortUser,
      setAsCohortMember,
      setAsCohortOwner,
      userId
    } = this.props;

    switch (dialogContext) {
      case MemberDialogContext.REMOVE:
        removeCohortUser(id, userId, isOwner);
        break;
      case MemberDialogContext.SET_MEMBER:
        setAsCohortMember(id, userId);
        break;
      case MemberDialogContext.SET_OWNER:
        setAsCohortOwner(id, userId);
        break;
      default:
        break;
    }

    this.handleDialogContext(null);
  };

  render() {
    const { areDetailsVisible, dialogContext, dialogTitle } = this.state;
    const { isCurrentOwner, avatarUrl, isOwner, name } = this.props;
    return (
      <Fragment>
        <div className="member-box">
          {!areDetailsVisible && (
            <div className="member-box__details">
              <button
                className="member-box__user-button"
                // onClick={this.handleDetailsVisibility}
                type="button"
              >
                {avatarUrl ? (
                  <img
                    alt={`${name} avatar`}
                    className="member-box__avatar"
                    src={avatarUrl}
                  />
                ) : (
                  <UserIcon />
                )}
              </button>
              <h3 className="member-box__heading">
                {name}
                <span className="member-box__role">
                  {` - ${isOwner ? 'owner' : 'member'}`}
                </span>
              </h3>
              {isCurrentOwner && (
                <ul className="member-box__panel">
                  <li className="member-box__option">
                    <button
                      className={classNames(
                        'member-box__button',
                        'primary-button',
                        {
                          'disabled-button': isOwner
                        }
                      )}
                      disabled={isOwner}
                      onClick={this.handleDialogContext(
                        MemberDialogContext.SET_OWNER
                      )}
                      type="button"
                    >
                      Set as a Owner
                    </button>
                    <p className="member-box__role-description">
                      {'Can edit, archive and delete this cohort. '}
                      {"Can add, edit list's items and mark them as done. "}
                      {'Can add, edit, archive and delete lists. '}
                      {'Can add, remove members, and change their roles. '}
                    </p>
                  </li>
                  <li className="member-box__option">
                    <button
                      className={classNames(
                        'member-box__button',
                        'primary-button',
                        {
                          'disabled-button': !isOwner
                        }
                      )}
                      disabled={!isOwner}
                      onClick={this.handleDialogContext(
                        MemberDialogContext.SET_MEMBER
                      )}
                      type="button"
                    >
                      Set as a member
                    </button>
                    <p className="member-box__role-description">
                      {"Can view lists, add and edit list's items."}
                    </p>
                  </li>
                  <li className="member-box__option">
                    <button
                      className="member-box__button primary-button"
                      onClick={this.handleDialogContext(
                        MemberDialogContext.REMOVE
                      )}
                      type="button"
                    >
                      Remove
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
        {dialogContext && (
          <Dialog
            onCancel={this.handleDialogContext(null)}
            onConfirm={this.handleConfirm}
            title={dialogTitle}
          />
        )}
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
