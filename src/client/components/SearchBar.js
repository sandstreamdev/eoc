import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import addItem from '../_dispatchers/addItem';

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
    console.log('Test');
    e.preventDefault();
    const newItem = {
      name: this.state.inputValue,
      isOrdered: false
    };

    const { addItem: add } = this.props;
    add(newItem);
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

export default connect(
  null,
  { addItem }
)(SearchBar);
