import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addItem } from './actions';
import MessageBox from '../MessageBox';
import { getNewItemStatus } from 'selectors';
import { StatusType, MessageType } from 'common/enums';
import { StatusPropType } from 'common/propTypes';

class InputBar extends Component {
  state = {
    itemAuthor: '',
    itemName: ''
  };

  handleNameChange = e => {
    this.setState({
      itemName: e.target.value
    });
  };

  handleAuthorChange = e => {
    this.setState({
      itemAuthor: e.target.value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const { addItem } = this.props;
    const { itemAuthor, itemName } = this.state;
    const newItem = {
      author: itemAuthor,
      isOrdered: false,
      name: itemName
    };

    addItem(newItem)
      .then(() => {
        this.setState({
          itemAuthor: '',
          itemName: ''
        });
      })
      .catch(err => console.error(err.message));
  };

  render() {
    const { itemAuthor, itemName } = this.state;
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
            <input
              className="input-bar__input"
              onChange={this.handleAuthorChange}
              placeholder="Your name"
              required
              type="text"
              value={itemAuthor}
            />
            <input className="input-bar__submit" type="submit" />
          </form>
        </div>
      </Fragment>
    );
  }
}

InputBar.propTypes = {
  newItemStatus: StatusPropType.isRequired,

  addItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  newItemStatus: getNewItemStatus(state)
});

export default connect(
  mapStateToProps,
  { addItem }
)(InputBar);
