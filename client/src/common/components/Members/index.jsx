import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { RouterMatchPropType } from 'common/constants/propTypes';
import { PlusIcon, DotsIcon } from 'assets/images/icons';
import MembersForm from './components/MembersForm';
import MemberDetails from './components/MemberDetails';
import MemberButton from './components/MemberButton';
import { addCohortMember } from 'modules/cohort/model/actions';
import { addListViewer } from 'modules/list/model/actions';
import { Routes } from 'common/constants/enums';
import { UserAddingStatus, MEMBERS_DISPLAY_LIMIT } from './const';
import InviteNewUser from './components/InviteNewUser';
import { inviteUser } from './model/actions';

class MembersBox extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      context: null,
      email: '',
      isFormVisible: false,
      isInvitationBoxVisible: false,
      membersDisplayLimit: MEMBERS_DISPLAY_LIMIT,
      pending: false
    };
  }

  showForm = () => this.setState({ isFormVisible: true });

  hideForm = () => this.setState({ isFormVisible: false });

  hideInvitationBox = () => this.setState({ isInvitationBoxVisible: false });

  showInvitationBox = () => this.setState({ isInvitationBoxVisible: true });

  handleDisplayingMemberDetails = id => () => {
    this.setState({ context: id });
  };

  handleClosingMemberDetails = () => {
    this.setState({ context: null });
  };

  handleAddMember = () => email => {
    const { addCohortMember, addListViewer } = this.props;
    const {
      match: {
        params: { id }
      },
      route
    } = this.props;

    const action = route === Routes.COHORT ? addCohortMember : addListViewer;

    this.setState({ pending: true });
    action(id, email).then(resp => {
      if (resp === UserAddingStatus.ADDED) {
        this.setState({ pending: false });
        this.hideForm();
      }

      if (email && resp === UserAddingStatus.NO_USER) {
        this.setState({
          email,
          pending: false
        });
        this.showInvitationBox();
      }
    });
  };

  handleShowMoreMembers = () => {
    const { members } = this.props;
    const membersLength = Object.keys(members).length;

    this.setState(({ membersDisplayLimit }) => ({
      membersDisplayLimit:
        membersDisplayLimit + (membersLength - MEMBERS_DISPLAY_LIMIT)
    }));
  };

  handleInvite = () => {
    const { email } = this.state;
    const { inviteUser } = this.props;

    return inviteUser(email).then(() => {
      this.hideForm();
      this.hideInvitationBox();
    });
  };

  handleCancel = () => {
    this.hideForm();
    this.hideInvitationBox();
    this.setState({ email: '' });
  };

  renderDetails = member => {
    const {
      isCohortList,
      isCurrentUserAnOwner,
      isPrivateList,
      onCohortLeave,
      onListLeave,
      route,
      type
    } = this.props;

    return (
      <MemberDetails
        {...member}
        isCohortList={isCohortList}
        isCurrentUserAnOwner={isCurrentUserAnOwner}
        isPrivateList={isPrivateList}
        onClose={this.handleClosingMemberDetails}
        onCohortLeave={onCohortLeave}
        onListLeave={onListLeave}
        route={route}
        type={type}
      />
    );
  };

  renderMemberList = () => {
    const { members } = this.props;
    const { membersDisplayLimit } = this.state;
    const membersList = Object.values(members);

    return membersList.slice(0, membersDisplayLimit).map(member => (
      <li
        className="members-box__list-item"
        key={member.avatarUrl}
        title={member.displayName}
      >
        <div className="members-box__button-mobile">
          <MemberButton
            member={member}
            onDisplayDetails={this.handleDisplayingMemberDetails(member._id)}
          />
        </div>
      </li>
    ));
  };

  renderShowMoreUsers = () => {
    const { members } = this.props;
    const { membersDisplayLimit } = this.state;
    const membersLength = Object.keys(members).length;

    return (
      <Fragment>
        {membersDisplayLimit < membersLength && (
          <li className="members-box__list-item">
            <button
              className="members-box__member"
              onClick={this.handleShowMoreMembers}
              type="button"
            >
              <DotsIcon />
            </button>
          </li>
        )}
      </Fragment>
    );
  };

  renderAddNewUserForm = () => {
    const { isCurrentUserAnOwner, isMember, route } = this.props;
    const { isInvitationBoxVisible, isFormVisible, pending } = this.state;
    const isAddMemberVisible =
      isCurrentUserAnOwner || (isMember && route === Routes.LIST);

    return (
      <Fragment>
        {isAddMemberVisible && (
          <li className="members-box__list-item">
            {isFormVisible ? (
              <MembersForm
                disabled={isInvitationBoxVisible || pending}
                onAddNew={this.handleAddMember()}
                pending={pending}
              />
            ) : (
              <button
                className="members-box__member"
                onClick={this.showForm}
                type="button"
              >
                <PlusIcon />
              </button>
            )}
          </li>
        )}
      </Fragment>
    );
  };

  render() {
    const { context, email, isInvitationBoxVisible } = this.state;
    const { members } = this.props;
    const currentUser = members[context];

    return (
      <div className="members-box">
        <header className="members-box__header">
          <h2 className="members-box__heading">Members</h2>
        </header>
        <ul className="members-box__list">
          {this.renderAddNewUserForm()}
          {this.renderMemberList()}
          {this.renderShowMoreUsers()}
        </ul>
        {isInvitationBoxVisible && (
          <InviteNewUser
            email={email}
            onCancel={this.handleCancel}
            onInvite={this.handleInvite}
          />
        )}
        {currentUser && this.renderDetails(currentUser)}
      </div>
    );
  }
}

MembersBox.propTypes = {
  isCohortList: PropTypes.bool,
  isCurrentUserAnOwner: PropTypes.bool,
  isMember: PropTypes.bool,
  isPrivateList: PropTypes.bool,
  match: RouterMatchPropType.isRequired,
  members: PropTypes.objectOf(PropTypes.object).isRequired,
  route: PropTypes.string.isRequired,
  type: PropTypes.string,

  addCohortMember: PropTypes.func.isRequired,
  addListViewer: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired,
  onCohortLeave: PropTypes.func,
  onListLeave: PropTypes.func
};

export default withRouter(
  connect(
    null,
    { addCohortMember, addListViewer, inviteUser }
  )(MembersBox)
);
