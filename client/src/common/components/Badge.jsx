import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './Badge.scss';

import { IntlPropType } from 'common/constants/propTypes';

const Badge = ({
  context,
  count,
  icon,
  intl: { formatMessage },
  totalCount
}) => (
  <span
    className="badge"
    title={formatMessage(
      { id: 'list.items-counter-label' },
      { count, totalCount, context }
    )}
  >
    {icon && <span className="badge__icon">{icon}</span>}
    <span className="badge__counter">{`${count}/${totalCount}`}</span>
  </span>
);

Badge.propTypes = {
  context: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  icon: PropTypes.any,
  intl: IntlPropType.isRequired,
  totalCount: PropTypes.number.isRequired
};

export default injectIntl(Badge);
