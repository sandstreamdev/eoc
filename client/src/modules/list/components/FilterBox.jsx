import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { IntlPropType } from 'common/constants/propTypes';

class FilterBox extends Component {
  handleFilterByChange = event => {
    const { onChange } = this.props;
    const filterBy = event.target.value;

    onChange(filterBy);
  };

  render() {
    const {
      filterBy,
      label,
      options,
      intl: { formatMessage }
    } = this.props;

    return (
      <div className="filter-box">
        <span className="filter-box__label">{label}</span>
        <select
          className="filter-box__select"
          name="filters"
          onChange={this.handleFilterByChange}
          value={filterBy}
        >
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {formatMessage({ id: `list.filter-box.${option.id}` })}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

FilterBox.propTypes = {
  filterBy: PropTypes.string.isRequired,
  intl: IntlPropType.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,

  onChange: PropTypes.func.isRequired
};

export default injectIntl(FilterBox);
