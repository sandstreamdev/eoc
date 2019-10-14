import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { EmailNotificationFrequency } from 'common/constants/enums';
import { IntlPropType } from 'common/constants/propTypes';
import './DaySelector.scss';

const DaySelector = ({ intl: { formatMessage }, onChange, selected }) => {
  console.log(selected);

  return (
    <div className="select-days">
      <select
        className="select-days__select"
        onChange={onChange}
        value={selected}
      >
        <option value={EmailNotificationFrequency.MONDAY}>
          {formatMessage({ id: 'common.monday' })}
        </option>
        <option value={EmailNotificationFrequency.TUESDAY}>
          {formatMessage({ id: 'common.tuesday' })}
        </option>
        <option value={EmailNotificationFrequency.WEDNESDAY}>
          {formatMessage({ id: 'common.wednesday' })}
        </option>
        <option value={EmailNotificationFrequency.THURSDAY}>
          {formatMessage({ id: 'common.thursday' })}
        </option>
        <option value={EmailNotificationFrequency.FRIDAY}>
          {formatMessage({ id: 'common.friday' })}
        </option>
        <option value={EmailNotificationFrequency.SATURDAY}>
          {formatMessage({ id: 'common.saturday' })}
        </option>
        <option value={EmailNotificationFrequency.SUNDAY}>
          {formatMessage({ id: 'common.sunday' })}
        </option>
      </select>
    </div>
  );
};

DaySelector.propTypes = {
  intl: IntlPropType.isRequired,
  selected: PropTypes.string,

  onChange: PropTypes.func.isRequired
};

export default injectIntl(DaySelector);
