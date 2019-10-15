import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { IntlPropType } from 'common/constants/propTypes';
import './DaySelector.scss';

const DaySelector = ({
  intl: { formatMessage },
  onChange,
  options,
  selected
}) => (
  <div className="select-days">
    <select
      className="select-days__select primary-select"
      onChange={onChange}
      value={selected}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {formatMessage({ id: option.message })}
        </option>
      ))}
    </select>
  </div>
);

DaySelector.propTypes = {
  intl: IntlPropType.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  selected: PropTypes.string,

  onChange: PropTypes.func.isRequired
};

export default injectIntl(DaySelector);
