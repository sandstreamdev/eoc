import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getCurrentUser } from 'modules/authorization/model/selectors';
import { getNewItemStatus } from 'modules/shopping-list/model/selectors';
import { StatusType, MessageType } from 'common/constants/enums';
import { StatusPropType, UserPropType } from 'common/constants/propTypes';
import MessageBox from 'common/components/MessageBox';
import { addItem } from './actions';

class InputBar extends Component {
  state = {
    itemName: ''
  };

  handleNameChange = e => {
    this.setState({
      itemName: e.target.value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const { addItem, currentUser } = this.props;
    const { itemName } = this.state;
    const newItem = {
      authorName: currentUser.name,
      authorId: currentUser.id,
      isOrdered: false,
      name: itemName
    };

    addItem(newItem);

    this.setState({
      itemName: ''
    });
  };

  render() {
    const { itemName } = this.state;
    const { newItemStatus } = this.props;
    return (
      <Fragment>
        {newItemStatus === StatusType.ERROR && (
          <MessageBox
            message="There was an error while adding new item. Try again later"
            type={MessageType.ERROR}
          />
        )}
        <div className="input-bar">
          <form className="input-bar__form" onSubmit={this.handleFormSubmit}>
            <input
              className="input-bar__input"
              onChange={this.handleNameChange}
              placeholder="What is missing?"
              required
              type="text"
              value={itemName}
            />
            <input className="input-bar__submit" type="submit" />
          </form>
        </div>
      </Fragment>
    );
  }
}

InputBar.propTypes = {
  currentUser: UserPropType.isRequired,
  newItemStatus: StatusPropType.isRequired,

  addItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  newItemStatus: getNewItemStatus(state)
});

export default connect(
  mapStateToProps,
  { addItem }
)(InputBar);
