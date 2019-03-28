import React, { PureComponent } from 'react';

import { DotsIcon, UserIcon, PlusIcon } from 'assets/images/icons';
import MembersForm from 'common/components/MembersForm';

class MembersBox extends PureComponent {
  state = {
    isAddNewVisible: false
  };

  handleAddNewVisibility = () => {
    const { isAddNewVisible } = this.state;
    this.setState({ isAddNewVisible: !isAddNewVisible });
  };

  handleShowAll = () => {
    console.log('show all members');
  };

  handleAddNew = data => {
    console.log(data);
  };

  render() {
    const { isAddNewVisible } = this.state;
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

export default MembersBox;
