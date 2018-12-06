import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addItem } from './actions';

class SearchBar extends Component {
  state = {
    inputValue: '',
    itemAddError: false
  };

  handleInputChange = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const { inputValue, itemAddError } = this.state;
    const { addItem } = this.props;
    const newItem = {
      name: inputValue,
      isOrdered: false
    };

    addItem(newItem).catch(err => {
      this.setState({
        itemAddError: true
      });
      console.error(err.message);
    });

    if (!itemAddError) {
      this.setState({
        inputValue: ''
      });
    }
  };

  render() {
    const { inputValue } = this.state;
    return (
      <div className="search-bar">
        <form className="search-bar__form" onSubmit={this.handleFormSubmit}>
          <input
            className="search-bar__input"
            onChange={this.handleInputChange}
            placeholder="What is missing?"
            type="text"
            value={inputValue}
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
