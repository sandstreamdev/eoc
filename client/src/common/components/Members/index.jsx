import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Manager, Reference } from 'react-popper';
import { withRouter } from 'react-router-dom';
import _debounce from 'lodash/debounce';

import { PlusIcon, DotsIcon } from 'assets/images/icons';
import MembersForm from './components/MembersForm';
import MemberBox from './components/MemberBox';
import MemberDetails from './components/MemberDetails';
import MemberButton from './components/MemberButton';
import { addCohortMember } from 'modules/cohort/model/actions';
import { addListViewer } from 'modules/list/model/actions';
import { Routes } from 'common/constants/enums';
import { UserCreationStatus } from './const';
import InviteNewUser from './components/InviteNewUser';

const MEMBERS_DISPLAY_LIMIT = 10;

class MembersBox extends PureComponent {
  handleResize = _debounce(
    () => this.setState({ isMobile: window.innerWidth < 400 }),
    100
  );

  constructor(props) {
    super(props);

    this.state = {
      context: null,
      email: '',
      inviteNewUser: false,
      isFormVisible: false,
      isMobile: window.outerWidth < 400,
      membersDisplayLimit: MEMBERS_DISPLAY_LIMIT,
      pending: false
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    this.handleResize.cancel();
    window.removeEventListener('resize', this.handleResize);
  }

  showForm = () => this.setState({ isFormVisible: true });

  hideForm = () => this.setState({ isFormVisible: false });

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
      if (resp === UserCreationStatus.CREATED) {
        this.setState({ pending: false });
        this.hideForm();
      }

      if (resp === UserCreationStatus.NO_USER) {
        this.setState({ email, pending: false, inviteNewUser: true });
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
    // ... send request to backend right here
  };

  handleCancel = () => {
    this.hideForm();
    this.setState({ inviteNewUser: false });
  };

  renderDetails = member => {
    const { isCohortList, isCurrentUserAnOwner, route, type } = this.props;

    return (
      <MemberDetails
        {...member}
        isCohortList={isCohortList}
        isCurrentUserAnOwner={isCurrentUserAnOwner}
        onClose={this.handleClosingMemberDetails}
        route={route}
        type={type}
      />
    );
  };

  renderMemberList = () => {
    const { members } = this.props;
    const { isMobile, context, membersDisplayLimit } = this.state;
    const membersList = Object.values(members);

    return membersList.slice(0, membersDisplayLimit).map(member => (
      <li
        className="members-box__list-item"
        key={member.avatarUrl}
        title={member.displayName}
      >
        {isMobile ? (
          <MemberButton
            member={member}
            onDisplayDetails={this.handleDisplayingMemberDetails(member._id)}
          />
        ) : (
          <Manager>
            <Reference>
              {({ ref }) => (
                <MemberButton
                  member={member}
                  onDisplayDetails={this.handleDisplayingMemberDetails(
                    member._id
                  )}
                  popperRef={ref}
                />
              )}
            </Reference>
            {context === member._id && (
              <MemberBox>{this.renderDetails(member)}</MemberBox>
            )}
          </Manager>
        )}
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
    const { isFormVisible, pending } = this.state;
    const isAddMemberVisible =
      isCurrentUserAnOwner || (isMember && route === Routes.LIST);

    return (
      <Fragment>
        {isAddMemberVisible && (
          <li className="members-box__list-item">
            {isFormVisible ? (
              <MembersForm
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
    const { context, email, inviteNewUser, isMobile } = this.state;
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
        {inviteNewUser && (
          <InviteNewUser
            email={email}
            onInvite={this.handleInvite}
            onCancel={this.handleCancel}
          />
        )}
        {isMobile && currentUser && this.renderDetails(currentUser)}
      </div>
    );
  }
}

MembersBox.propTypes = {
  isCurrentUserAnOwner: PropTypes.bool,
  isMember: PropTypes.bool,
  members: PropTypes.objectOf(PropTypes.object).isRequired,
  route: PropTypes.string.isRequired,
  type: PropTypes.string,

  addCohortMember: PropTypes.func.isRequired,
  addListViewer: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { addCohortMember, addListViewer }
  )(MembersBox)
);
