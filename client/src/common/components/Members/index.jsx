import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _map from 'lodash/map';
import PropTypes from 'prop-types';
import { Manager } from 'react-popper';
import { withRouter } from 'react-router-dom';

import { DotsIcon, PlusIcon } from 'assets/images/icons';
import MembersForm from './components/MembersForm';
import MemberBox from './components/MemberBox';
import MemberDetails from './components/MemberDetails';
import MemberButton from './components/MemberButton';
import { addCohortMember } from 'modules/cohort/model/actions';
import { addListMember } from 'modules/list/model/actions';
import { Routes } from 'common/constants/enums';

class MembersBox extends PureComponent {
  state = {
    isFormVisible: false,
    context: null,
    pending: false
  };

  showForm = () => this.setState({ isFormVisible: true });

  hideForm = () => this.setState({ isFormVisible: false });

  handleDisplayingMemberDetails = id => () => {
    this.setState({ context: id });
  };

  handleClosingMemberDetails = () => {
    this.setState({ context: null });
  };

  handleAddNewMember = () => email => {
    const { addCohortMember, addListMember } = this.props;
    const {
      match: {
        params: { id }
      },
      route
    } = this.props;

    const action = route === Routes.COHORT ? addCohortMember : addListMember;

    this.setState({ pending: true });

    action(id, email).finally(() => {
      this.setState({ pending: false });
      this.hideForm();
    });
  };

  renderMemberList = () => {
    const { isCurrentUserAnOwner, isPrivate, members, route } = this.props;
    const { context } = this.state;

    return _map(members, member => (
      <li
        className="members-box__list-item"
        key={member.avatarUrl}
        title={member.displayName}
      >
        <Manager>
          <MemberButton
            onDisplayDetails={this.handleDisplayingMemberDetails(member._id)}
            member={member}
          />
          {context === member._id && (
            <MemberBox>
              <MemberDetails
                {...member}
                isCurrentUserAnOwner={isCurrentUserAnOwner}
                onClose={this.handleClosingMemberDetails}
                isPrivate={isPrivate}
                route={route}
              />
            </MemberBox>
          )}
        </Manager>
      </li>
    ));
  };

  render() {
    const { isFormVisible, pending } = this.state;
    return (
      <div className="members-box">
        <header className="members-box__header">
          <h2 className="members-box__heading">Members</h2>
        </header>
        <ul className="members-box__list">
          <li className="members-box__list-item">
            {isFormVisible ? (
              <MembersForm
                onAddNew={this.handleAddNewMember()}
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
          {this.renderMemberList()}
          <li className="members-box__list-item">
            <button className="members-box__member" type="button">
              <DotsIcon />
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

MembersBox.propTypes = {
  isCurrentUserAnOwner: PropTypes.bool.isRequired,
  isPrivate: PropTypes.bool,
  route: PropTypes.string.isRequired,
  members: PropTypes.objectOf(PropTypes.object).isRequired,

  addCohortMember: PropTypes.func.isRequired,
  addListMember: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { addCohortMember, addListMember }
  )(MembersBox)
);
