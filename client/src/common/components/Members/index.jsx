import React, { PureComponent } from 'react';
import _map from 'lodash/map';
import PropTypes from 'prop-types';
import { Manager } from 'react-popper';
import { connect } from 'react-redux';
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
    context: null
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
    this.hideForm();
    const { addCohortMember, addListMember } = this.props;
    const {
      match: {
        params: { id }
      },
      route
    } = this.props;

    switch (route) {
      case Routes.COHORT:
        addCohortMember(id, email);
        break;
      case Routes.LIST:
        addListMember(id, email);
        break;
      default:
        break;
    }
  };

  render() {
    const { context, isFormVisible } = this.state;
    const { isCurrentOwner, route, users } = this.props;
    return (
      <div className="members-box">
        <header className="members-box__header">
          <h2 className="members-box__heading">Members</h2>
        </header>
        <ul className="members-box__list">
          <li className="members-box__list-item">
            {isFormVisible ? (
              <MembersForm onAddNew={this.handleAddNewMember()} />
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
          {_map(users, user => (
            <li
              className="members-box__list-item"
              key={user.avatarUrl}
              title={user.displayName}
            >
              <Manager>
                <MemberButton
                  onDisplayDetails={this.handleDisplayingMemberDetails(
                    user._id
                  )}
                  user={user}
                />
                {context === user._id && (
                  <MemberBox>
                    <MemberDetails
                      {...user}
                      isCurrentOwner={isCurrentOwner}
                      onClose={this.handleClosingMemberDetails}
                      route={route}
                    />
                  </MemberBox>
                )}
              </Manager>
            </li>
          ))}
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
  isCurrentOwner: PropTypes.bool.isRequired,
  route: PropTypes.string.isRequired,
  users: PropTypes.objectOf(PropTypes.object).isRequired,

  addCohortMember: PropTypes.func.isRequired,
  addListMember: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { addCohortMember, addListMember }
  )(MembersBox)
);
