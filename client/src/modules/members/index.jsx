import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { DotsIcon, UserIcon, PlusIcon } from 'assets/images/icons';
import MembersForm from './components/MembersForm';
import MemberBox from './components/MemberBox';

class MembersBox extends PureComponent {
  state = {
    isAddNewVisible: false,
    memberDetails: null
  };

  handleAddNewVisibility = () => {
    const { isAddNewVisible } = this.state;
    this.setState({ isAddNewVisible: !isAddNewVisible });
  };

  handleDisplayingMemberDetails = (name, userId, avatarUrl, isOwner) => () =>
    this.setState({ memberDetails: { avatarUrl, isOwner, name, userId } });

  handleShowAll = () => {
    // console.log('show all members');
  };

  handleAddNew = data => {
    // console.log(data);
  };

  render() {
    const { isAddNewVisible, memberDetails } = this.state;
    const { isCurrentOwner } = this.props;
    return (
      <div className="members-box">
        <header className="members-box__header">
          <h2 className="members-box__heading">Members</h2>
        </header>
        <ul className="members-box__list">
          <li className="members-box__list-item">
            {isAddNewVisible ? (
              <MembersForm onAddNew={this.handleAddNew} />
            ) : (
              <button
                className="members-box__member"
                onClick={this.handleAddNewVisibility}
                type="button"
              >
                <PlusIcon />
              </button>
            )}
          </li>
          <li className="members-box__list-item">
            {/* {memberDetails ? (
              <MemberBox isCurrentOwner={isCurrentOwner} {...memberDetails} />
            ) : ( */}
            <button
              className="members-box__member"
              onClick={this.handleDisplayingMemberDetails(
                'Jan Kowalski',
                '01234',
                '',
                true
              )}
              type="button"
            >
              <UserIcon />
            </button>
            {/* )} */}
            {memberDetails && (
              <MemberBox isCurrentOwner={isCurrentOwner} {...memberDetails} />
            )}
          </li>
          <li className="members-box__list-item">
            <button
              className="members-box__member"
              onClick={this.handleDisplayingMemberDetails(
                'John Doe',
                'abcde',
                '',
                true
              )}
              type="button"
            >
              <UserIcon />
            </button>
          </li>
          <li className="members-box__list-item">
            <button
              className="members-box__member"
              onClick={this.handleDisplayingMemberDetails(
                'Maria Wow',
                'fghij',
                '',
                false
              )}
              type="button"
            >
              <UserIcon />
            </button>
          </li>
          <li className="members-box__list-item">
            <button className="members-box__member" type="button">
              <DotsIcon />
            </button>
          </li>
        </ul>
        {/* {memberDetails && (
          <MemberBox isCurrentOwner={isCurrentOwner} {...memberDetails} />
        )} */}
      </div>
    );
  }
}

MembersBox.propTypes = { isCurrentOwner: PropTypes.bool.isRequired };

export default MembersBox;
