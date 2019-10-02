import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import {
  IntlPropType,
  RouterMatchPropType,
  UserPropType
} from 'common/constants/propTypes';
import { CloseIcon, InfoIcon } from 'assets/images/icons';
import { getCurrentUser } from 'modules/user/model/selectors';
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
import { ListType } from 'modules/list/consts';
import { formatName, makeAbortablePromise } from 'common/utils/helpers';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import MemberDetailsHeader from './MemberDetailsHeader';
import MemberRole from 'common/components/Members/components/MemberRole';
import './MemberDetails.scss';

const infoText = {
  [Routes.COHORT]: {
    [UserRoles.OWNER]: 'common.member-details.cohort.user-roles-owner',
    [UserRoles.MEMBER]: 'common.member-details.cohort.user-roles-member'
  },
  [Routes.LIST]: {
    [UserRoles.OWNER]: 'common.member-details.sack.user-roles-owner',
    [UserRoles.MEMBER]: 'common.member-details.sack.user-roles-member'
  }
};

class MemberDetails extends PureComponent {
  pendingPromises = [];

  constructor(props) {
    super(props);

    this.state = {
      isConfirmationVisible: false,
      isLeaveConfirmationVisible: false,
      isMemberInfoVisible: false,
      isOwnerInfoVisible: false,
      pending: false
    };
  }

  componentWillUnmount() {
    this.pendingPromises.forEach(promise => promise.abort());
  }

  handleConfirmationVisibility = () =>
    this.setState(({ isConfirmationVisible }) => ({
      isConfirmationVisible: !isConfirmationVisible
    }));

  handleMemberRemoving = () => {
    const {
      displayName,
      intl: { formatMessage },
      isOwner,
      match: {
        params: { id }
      },
      removeCohortMember,
      removeListMember,
      route,
      _id: userId
    } = this.props;
    const formattedName = formatName(displayName, formatMessage);
    const action =
      route === Routes.COHORT ? removeCohortMember : removeListMember;

    this.setState({ pending: true });

    const abortablePromise = makeAbortablePromise(
      action(id, formattedName, userId, isOwner)
    );
    this.pendingPromises.push(abortablePromise);

    abortablePromise.promise
      .then(() => this.setState({ pending: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pending: false });
        }
      });
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

  removeRole = (isCurrentUserRoleChanging, removeRoleAction, userName) => (
    id,
    userId
  ) => removeRoleAction(id, userId, userName, isCurrentUserRoleChanging);

  changeCohortRole = () => {
    const {
      _id: userId,
      addOwnerRoleInCohort,
      currentUser: { id: currentUserId },
      displayName,
      intl: { formatMessage },
      isOwner,
      match: {
        params: { id }
      },
      removeOwnerRoleInCohort
    } = this.props;
    const isCurrentUserRoleChanging = currentUserId === userId;
    const formattedUserName = formatName(displayName, formatMessage);

    this.setState({ pending: true });

    const action = isOwner
      ? this.removeRole(
          isCurrentUserRoleChanging,
          removeOwnerRoleInCohort,
          formattedUserName
        )
      : addOwnerRoleInCohort;

    action(id, userId, formattedUserName).finally(() =>
      this.setState({ pending: false })
    );
  };

  changeListRole = selectedRole => {
    const {
      _id: userId,
      addMemberRoleInList,
      addOwnerRoleInList,
      currentUser: { id: currentUserId },
      displayName,
      intl: { formatMessage },
      isMember,
      isOwner,
      match: {
        params: { id }
      },
      removeMemberRoleInList,
      removeOwnerRoleInList
    } = this.props;
    const isCurrentUserRoleChanging = currentUserId === userId;
    const formattedName = formatName(displayName, formatMessage);
    let action;

    this.setState({ pending: true });

    switch (selectedRole) {
      case UserRoles.OWNER:
        action = isOwner
          ? this.removeRole(
              isCurrentUserRoleChanging,
              removeOwnerRoleInList,
              formattedName
            )
          : addOwnerRoleInList;
        break;
      case UserRoles.MEMBER:
        action = isMember
          ? this.removeRole(
              isCurrentUserRoleChanging,
              removeMemberRoleInList,
              formattedName
            )
          : addMemberRoleInList;
        break;
      default:
        break;
    }

    action(id, userId, formattedName).finally(() =>
      this.setState({ pending: false })
    );
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

  handleLeave = () => {
    const { onCohortLeave, onListLeave, route } = this.props;

    this.setState({ pending: true });

    let action;
    switch (route) {
      case Routes.LIST:
        action = onListLeave;
        break;
      case Routes.COHORT:
        action = onCohortLeave;
        break;
      default:
        break;
    }

    const abortablePromise = makeAbortablePromise(action());

    this.pendingPromises.push(abortablePromise);
    abortablePromise.promise
      .then(() => this.setState({ pending: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pending: false });
        }
      });
  };

  handleLeaveConfirmationVisibility = () =>
    this.setState(({ isLeaveConfirmationVisible }) => ({
      isLeaveConfirmationVisible: !isLeaveConfirmationVisible
    }));

  renderChangeRoleOption = (role, isInfoVisible, checked) => {
    const { pending } = this.state;
    const { route } = this.props;
    const disabled = route === Routes.COHORT && role === UserRoles.MEMBER;
    const label =
      role === UserRoles.OWNER
        ? UserRolesToDisplay.OWNER
        : UserRolesToDisplay.MEMBER;

    return (
      <Fragment>
        <div className="member-details__option-header">
          <button
            className="member-details__info-button"
            disabled={pending}
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
            disabled={pending || disabled}
            label={label}
            onChange={disabled ? null : this.handleChangingRoles}
            value={role}
          />
        </div>
        {isInfoVisible && (
          <p className="member-details__role-description">
            <FormattedMessage id={infoText[route][role]} />
          </p>
        )}
      </Fragment>
    );
  };

  renderRemoveOption = () => {
    const { isConfirmationVisible, pending } = this.state;
    const {
      displayName,
      intl: { formatMessage }
    } = this.props;
    const formattedName = formatName(displayName, formatMessage);

    return isConfirmationVisible ? (
      <div className="member-details__confirmation">
        <h4>{`Do you really want to remove ${formattedName}?`}</h4>
        <button
          className="primary-button"
          onClick={this.handleMemberRemoving}
          type="button"
        >
          <FormattedMessage id="common.button.confirm" />
        </button>
        <button
          className="primary-button"
          onClick={this.handleConfirmationVisibility}
          type="button"
        >
          <FormattedMessage id="common.button.cancel" />
        </button>
      </div>
    ) : (
      <button
        className="member-details__button primary-button"
        disabled={pending}
        onClick={this.handleConfirmationVisibility}
        type="button"
      >
        <FormattedMessage id="common.member-details.remove" />
      </button>
    );
  };

  renderDetails = () => {
    const { isMemberInfoVisible, isOwnerInfoVisible } = this.state;
    const {
      _id: userId,
      currentUser: { id: currentUserId },
      isGuest,
      isMember,
      isOwner,
      route,
      type
    } = this.props;
    const isRemoveOptionVisible =
      (route === Routes.COHORT || type === ListType.LIMITED || isGuest) &&
      userId !== currentUserId;

    return (
      <ul className="member-details__options">
        <li className="member-details__option">
          {this.renderChangeRoleOption(
            UserRoles.OWNER,
            isOwnerInfoVisible,
            isOwner
          )}
        </li>
        {route === Routes.LIST && (
          <li className="member-details__option">
            {this.renderChangeRoleOption(
              UserRoles.MEMBER,
              isMemberInfoVisible,
              isMember
            )}
          </li>
        )}
        {isRemoveOptionVisible && (
          <li className="member-details__option member-details__option--removing">
            {this.renderRemoveOption()}
          </li>
        )}
      </ul>
    );
  };

  renderLeaveOption = () => {
    const {
      _id: userId,
      currentUser: { id: currentUserId },
      onClose,
      route
    } = this.props;
    const { isLeaveConfirmationVisible, pending } = this.state;

    if (userId !== currentUserId) {
      return null;
    }

    return (
      <div className="member-details__leave-box">
        {isLeaveConfirmationVisible ? (
          <div className="member-details__leave-box-confirmation">
            <FormattedMessage id="common.member-details.leave-box-heading" />
            <footer className="member-details__leave-box-confirmation-footer">
              <button
                className="primary-button"
                disabled={pending}
                onClick={this.handleLeave}
                type="button"
              >
                <FormattedMessage id="common.button.confirm" />
              </button>
              <button
                className="primary-button"
                disabled={pending}
                onClick={onClose}
                type="button"
              >
                <FormattedMessage id="common.button.cancel" />
              </button>
            </footer>
          </div>
        ) : (
          <button
            className="primary-button"
            onClick={this.handleLeaveConfirmationVisibility}
            type="button"
          >
            <FormattedMessage
              id="common.member-details.leave"
              values={{ data: route === Routes.LIST ? 'list' : 'cohort' }}
            />
          </button>
        )}
      </div>
    );
  };

  render() {
    const {
      avatarUrl,
      displayName,
      intl: { formatMessage },
      isCohortList,
      isCurrentUserAnOwner,
      isGuest,
      isMember,
      isOwner,
      isPrivateList,
      onClose,
      route
    } = this.props;
    const { pending } = this.state;
    const formattedName = formatName(displayName, formatMessage);
    const isLeaveButtonDisplayed =
      route === Routes.COHORT || isPrivateList || (!isPrivateList && isGuest);
    const role = (
      <MemberRole
        isCohortList={isCohortList}
        isGuest={isGuest}
        isMember={isMember}
        isOwner={isOwner}
      />
    );

    return (
      <Fragment>
        <div className="member-details">
          <button
            className="member-details__close"
            onClick={onClose}
            type="button"
          >
            <CloseIcon />
          </button>
          <div className="member-details__details">
            <MemberDetailsHeader
              avatarUrl={avatarUrl}
              displayName={formattedName}
              role={role}
            />
            <div className="member-details__panel">
              {isCurrentUserAnOwner && this.renderDetails()}
              {pending && <Preloader />}
            </div>
            {isLeaveButtonDisplayed && this.renderLeaveOption()}
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
  intl: IntlPropType.isRequired,
  isCohortList: PropTypes.bool,
  isCurrentUserAnOwner: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool,
  isMember: PropTypes.bool,
  isOwner: PropTypes.bool,
  isPrivateList: PropTypes.bool,
  match: RouterMatchPropType.isRequired,
  route: PropTypes.string,
  type: PropTypes.string,

  addMemberRoleInList: PropTypes.func.isRequired,
  addOwnerRoleInCohort: PropTypes.func.isRequired,
  addOwnerRoleInList: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCohortLeave: PropTypes.func,
  onListLeave: PropTypes.func,
  removeCohortMember: PropTypes.func.isRequired,
  removeListMember: PropTypes.func.isRequired,
  removeMemberRoleInList: PropTypes.func.isRequired,
  removeOwnerRoleInCohort: PropTypes.func.isRequired,
  removeOwnerRoleInList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  withRouter,
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
  )
)(MemberDetails);
