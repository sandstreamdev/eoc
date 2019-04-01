import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _map from 'lodash/map';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { DotsIcon, PlusIcon } from 'assets/images/icons';
import MembersForm from './components/MembersForm';
import { getMembers as getCohortMembers } from 'modules/cohort/model/selectors';

class MembersBox extends PureComponent {
  state = {
    isFormVisible: false
  };

  showForm = () => this.setState({ isFormVisible: true });

  hideForm = () => this.setState({ isFormVisible: false });

  handleOnAddNew = () => data => {
    const { onAddNew } = this.props;

    this.hideForm();
    onAddNew(data);
  };

  render() {
    const { isFormVisible } = this.state;
    const { users } = this.props;
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
              <button
                className="members-box__member"
                title={user.displayName}
                type="button"
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
