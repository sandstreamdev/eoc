import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { dispatchNewItem } from './actions';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: ''
    };
  }

  handleInputChange = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const { inputValue } = this.state;
    const newItem = {
      name: inputValue,
      isOrdered: false
    };

    const { dispatchNewItem: addNewItem } = this.props;
    addNewItem(newItem);
  };

  render() {
    const { inputValue } = this.state;
    return (
      <div className="search-bar">
        <form className="search-bar__form" onSubmit={this.handleFormSubmit}>
          <input
            className="search-bar__input"
            placeholder="What is missing?"
            onChange={this.handleInputChange}
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
  dispatchNewItem: PropTypes.func
};

export default connect(
  null,
  { dispatchNewItem }
)(SearchBar);
