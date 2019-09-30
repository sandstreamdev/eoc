import React from 'react';
import PropTypes from 'prop-types';
import './Chips.scss';

const Chips = ({ count, icon, title, totalCount }) => (
  <span className="chips" title={title}>
    {icon && <span className="chips__icon">{icon}</span>}
    <span className="chips__counter">{`${count}/${totalCount}`}</span>
  </span>
);

Chips.propTypes = {
  count: PropTypes.number.isRequired,
  icon: PropTypes.any,
  title: PropTypes.string.isRequired,
  totalCount: PropTypes.number.isRequired
};

export default Chips;
