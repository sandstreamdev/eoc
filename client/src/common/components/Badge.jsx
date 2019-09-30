import React from 'react';
import PropTypes from 'prop-types';
import './Badge.scss';

const Badge = ({ count, icon, title, totalCount }) => (
  <span className="badge" title={title}>
    {icon && <span className="badge__icon">{icon}</span>}
    <span className="badge__counter">{`${count}/${totalCount}`}</span>
  </span>
);

Badge.propTypes = {
  count: PropTypes.number.isRequired,
  icon: PropTypes.any,
  title: PropTypes.string.isRequired,
  totalCount: PropTypes.number.isRequired
};

export default Badge;
