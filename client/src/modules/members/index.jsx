import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _map from 'lodash/map';
import PropTypes from 'prop-types';

import { DotsIcon, PlusIcon } from 'assets/images/icons';
import MembersForm from './components/MembersForm';
import { getMembers } from './model/selectors';
import { clearMembers } from './model/actions';

class MembersBox extends PureComponent {
  state = {
    isAddNewVisible: false
  };

  componentWillUnmount() {
    const { clearMembers } = this.props;

    clearMembers();
  }

  showAddNewForm = () => this.setState({ isAddNewVisible: true });

  hideAddNewForm = () => this.setState({ isAddNewVisible: false });

  handleOnAddNew = () => data => {
    const { onAddNew } = this.props;

    this.hideAddNewForm();
    onAddNew(data);
  };

  render() {
    const { isAddNewVisible } = this.state;
    const { users } = this.props;
    return (
      <div className="members-box">
        <header className="members-box__header">
          <h2 className="members-box__heading">Members</h2>
        </header>
        <ul className="members-box__list">
          <li className="members-box__list-item">
            {isAddNewVisible ? (
              <MembersForm onAddNew={this.handleOnAddNew()} />
            ) : (
              <button
                className="members-box__member"
                onClick={this.showAddNewForm}
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
              <button
                className="members-box__member"
                type="button"
                title={user.displayName}
              >
                <img
                  alt={`${user.displayName} avatar`}
                  className="members-box__avatar"
                  src={user.avatarUrl}
                  title={user.displayName}
                />
              </button>
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
  users: PropTypes.objectOf(PropTypes.object).isRequired,

  clearMembers: PropTypes.func,
  onAddNew: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  users: getMembers(state)
});

export default connect(
  mapStateToProps,
  { clearMembers }
)(MembersBox);
