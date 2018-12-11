import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addItem } from './actions';

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
    const { itemName, itemAuthor } = this.state;
    const newItem = {
      author: itemAuthor,
      isOrdered: false,
      name: itemName
    };

    addItem(newItem).catch(err => {
      console.error(err.message);
    });

    this.setState({
      itemAuthor: '',
      itemName: ''
    });
  };

  render() {
    const { itemAuthor, itemName } = this.state;
    return (
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
    );
  }
}

SearchBar.propTypes = {
  addItem: PropTypes.func.isRequired
};

export default connect(
  null,
  { addItem }
)(SearchBar);
