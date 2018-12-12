import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addItem } from './actions';
import MessageBox from '../MessageBox';

class SearchBar extends Component {
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

    addItem(newItem);

    this.setState({
      itemAuthor: '',
      itemName: ''
    });
  };

  render() {
    const { itemAuthor, itemName } = this.state;
    const { newItemStatus } = this.props;
    return (
      <Fragment>
        {newItemStatus === 'error' && (
          <MessageBox
            message="There was an error while adding new item. Try again later"
            type="error"
          />
        )}
        <div className="search-bar">
          <form className="search-bar__form" onSubmit={this.handleFormSubmit}>
            <input
              className="search-bar__input"
              onChange={this.handleNameChange}
              placeholder="What is missing?"
              required
              type="text"
              value={itemName}
            />
            <input
              className="search-bar__input"
              onChange={this.handleAuthorChange}
              placeholder="Your name"
              required
              type="text"
              value={itemAuthor}
            />
            <input className="search-bar__submit" type="submit" />
          </form>
        </div>
      </Fragment>
    );
  }
}

SearchBar.propTypes = {
  addItem: PropTypes.func.isRequired,
  newItemStatus: PropTypes.string
};

const mapStateToProps = state => ({
  newItemStatus: state.uiStatus.newItemStatus
});

export default connect(
  mapStateToProps,
  { addItem }
)(SearchBar);
