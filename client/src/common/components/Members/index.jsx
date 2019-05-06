import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _map from 'lodash/map';
import PropTypes from 'prop-types';
import { Manager, Reference } from 'react-popper';
import { withRouter } from 'react-router-dom';
import _debounce from 'lodash/debounce';

import { DotsIcon, PlusIcon } from 'assets/images/icons';
import MembersForm from './components/MembersForm';
import MemberBox from './components/MemberBox';
import MemberDetails from './components/MemberDetails';
import MemberButton from './components/MemberButton';
import { addCohortMember } from 'modules/cohort/model/actions';
import { addListViewer } from 'modules/list/model/actions';
import { Routes } from 'common/constants/enums';

class MembersBox extends PureComponent {
  state = {
    context: null,
    isFormVisible: false,
    isMobile: window.outerWidth < 400,
    pending: false
  };

  componentDidMount() {
    window.addEventListener('resize', _debounce(this.handleResize, 100));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => this.setState({ isMobile: window.outerWidth < 400 });

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

    action(id, email).finally(() => {
      this.setState({ pending: false });
      this.hideForm();
    });
  };

  renderDetails = member => {
    const { isCurrentUserAnOwner, route, isCohortList, type } = this.props;

    return (
      <MemberDetails
        {...member}
        isCohortList={isCohortList}
        isCurrentUserAnOwner={isCurrentUserAnOwner}
        type={type}
        onClose={this.handleClosingMemberDetails}
        route={route}
      />
    );
  };

  renderMemberList = () => {
    const { members } = this.props;
    const { isMobile, context } = this.state;

    return _map(members, member => (
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

  render() {
    const { isFormVisible, context, isMobile, pending } = this.state;
    const { isCurrentUserAnOwner, members } = this.props;
    const currentUser = members[context];

    return (
      <div className="members-box">
        <header className="members-box__header">
          <h2 className="members-box__heading">Members</h2>
        </header>
        <ul className="members-box__list">
          {isCurrentUserAnOwner && (
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
          {this.renderMemberList()}
          <li className="members-box__list-item">
            <button className="members-box__member" type="button">
              <DotsIcon />
            </button>
          </li>
        </ul>
        {isMobile && currentUser && this.renderDetails(currentUser)}
      </div>
    );
  }
}

MembersBox.propTypes = {
  isCurrentUserAnOwner: PropTypes.bool,
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
