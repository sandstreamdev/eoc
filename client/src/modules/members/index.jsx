import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { DotsIcon, UserIcon, PlusIcon } from 'assets/images/icons';
import MembersForm from './components/MembersForm';
import MemberBox from './components/MemberBox';

class MembersBox extends PureComponent {
  state = {
    isAddNewVisible: false
  };

  handleAddNewVisibility = () => {
    const { isAddNewVisible } = this.state;
    this.setState({ isAddNewVisible: !isAddNewVisible });
  };

  handleShowAll = () => {
    // console.log('show all members');
  };

  handleAddNew = data => {
    // console.log(data);
  };

  render() {
    const { isAddNewVisible } = this.state;
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
            <MemberBox
              isCurrentOwner={isCurrentOwner}
              isOwner
              name="Name Surname"
              userId="abcde"
            />
          </li>
          <li className="members-box__list-item">
            <button className="members-box__member" type="button">
              <UserIcon />
            </button>
          </li>
          <li className="members-box__list-item">
            <button className="members-box__member" type="button">
              <UserIcon />
            </button>
          </li>
          <li className="members-box__list-item">
            <button
              className="members-box__member"
              onClick={this.handleShowAll}
              type="button"
            >
              <DotsIcon />
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

MembersBox.propTypes = { isCurrentOwner: PropTypes.bool.isRequired };

export default MembersBox;
