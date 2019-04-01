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
import { getMembers as getCohortMembers } from 'modules/cohort/model/selectors';

class MembersBox extends PureComponent {
  state = {
    isFormVisible: false,
    context: null
  };

  showForm = () => this.setState({ isFormVisible: true });

  hideForm = () => this.setState({ isFormVisible: false });

  handleDisplayingMemberDetails = user => () => {
    const { _id: userId } = user;
    this.setState({ context: userId });
  };

  handleClosingMemberDetails = () => {
    this.setState({ context: null });
  };

  handleOnAddNew = () => data => {
    const { onAddNew } = this.props;

    this.hideForm();
    onAddNew(data);
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
              <MembersForm onAddNew={this.handleOnAddNew()} />
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
                  user={user}
                  onDisplayDetails={this.handleDisplayingMemberDetails(user)}
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

  onAddNew: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { id }
    }
  } = ownProps;
  return { users: getCohortMembers(state, id) };
};

export default withRouter(connect(mapStateToProps)(MembersBox));
