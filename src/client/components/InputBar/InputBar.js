import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addItem } from './actions';
import MessageBox from '../MessageBox';

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
      author: currentUser,
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
        {newItemStatus === 'error' && (
          <MessageBox
            message="There was an error while adding new item. Try again later"
            type="error"
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
  addItem: PropTypes.func.isRequired,
  currentUser: PropTypes.string,
  newItemStatus: PropTypes.string
};

const mapStateToProps = state => ({
  newItemStatus: state.uiStatus.newItemStatus,
  currentUser: state.currentUser
});

export default connect(
  mapStateToProps,
  { addItem }
)(InputBar);
