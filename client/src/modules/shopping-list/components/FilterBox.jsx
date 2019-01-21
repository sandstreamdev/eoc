import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FilterBox extends Component {
  handleFilterByChange = event => {
    const { onChange } = this.props;
    const filterBy = event.target.value;

    onChange(filterBy);
  };

  render() {
    const { filterBy, label, options } = this.props;

    return (
      <div className="filter-box">
        <span className="filter-box__label">{label}</span>
        <select
          className="filter-box__select"
          onChange={this.handleFilterByChange}
          value={filterBy}
        >
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

FilterBox.propTypes = {
  filterBy: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,

  onChange: PropTypes.func.isRequired
};

export default FilterBox;
