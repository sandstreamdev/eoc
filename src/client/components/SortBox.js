import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ArrowIcon from '../assets/images/arrow-up-solid.svg';
import { SortOrderPropType } from '../common/propTypes';
import { SortOrderType } from '../common/enums';

class SortBox extends Component {
  handleSortByChange = event => {
    const { onChange, sortOrder } = this.props;
    const sortBy = event.target.value;

    onChange(sortBy, sortOrder);
  };

  handleSortOrderChange = () => {
    const { onChange, sortOrder, sortBy } = this.props;

    onChange(
      sortBy,
      sortOrder === SortOrderType.ASCENDING
        ? SortOrderType.DESCENDING
        : SortOrderType.ASCENDING
    );
  };

  render() {
    const { label, options, sortBy, sortOrder } = this.props;

    const orderButtonClass = classNames('sort-box__button', {
      'sort-box__button--obverse': sortOrder === SortOrderType.ASCENDING
    });

    return (
      <div className="sort-box">
        <span className="sort-box__desc">{label}</span>
        <select
          className="sort-box__select"
          onChange={this.handleSortByChange}
          value={sortBy}
        >
          {options.map(option => (
            <option key={option.label} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="sort-box__controllers">
          <button
            className={orderButtonClass}
            onClick={this.handleSortOrderChange}
            type="button"
          >
            <img alt="Arrow icon" src={ArrowIcon} />
          </button>
        </div>
      </div>
    );
  }
}

SortBox.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  sortBy: PropTypes.string.isRequired,
  sortOrder: SortOrderPropType.isRequired,

  onChange: PropTypes.func.isRequired
};

export default SortBox;
