import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import ArrowIcon from 'assets/images/arrow-up-solid.svg';
import { SortOrderPropType, IntlPropType } from '../constants/propTypes';
import { SortOrderType } from '../constants/enums';

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
    const {
      intl: { formatMessage },
      label,
      options,
      sortBy,
      sortOrder
    } = this.props;

    const orderButtonClass = classNames('sort-box__button', {
      'sort-box__button--obverse': sortOrder === SortOrderType.ASCENDING
    });

    return (
      <div className="sort-box">
        <label className="sort-box__desc">{label}</label>
        <select
          className="sort-box__select"
          onChange={this.handleSortByChange}
          value={sortBy}
          name="sorting options"
        >
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {formatMessage({ id: option.label })}
            </option>
          ))}
        </select>
        <div className="sort-box__controllers">
          <button
            className={orderButtonClass}
            onClick={this.handleSortOrderChange}
            type="button"
          >
            <img
              alt={formatMessage(
                {
                  id: 'common.sort-box.sort'
                },
                { sortOrder }
              )}
              src={ArrowIcon}
            />
          </button>
        </div>
      </div>
    );
  }
}

SortBox.propTypes = {
  intl: IntlPropType.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  sortBy: PropTypes.string.isRequired,
  sortOrder: SortOrderPropType.isRequired,

  onChange: PropTypes.func.isRequired
};

export default injectIntl(SortBox);
