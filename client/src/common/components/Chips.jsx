import React from 'react';
import PropTypes from 'prop-types';
import './Chips.scss';

const Chips = ({ count, icon, title }) => (
  <figure className="chips" title={title}>
    {icon && <span className="chips__icon">{icon}</span>}
    <span className="chips__counter">{count}</span>
  </figure>
);

Chips.propTypes = {
  count: PropTypes.number.isRequired,
  icon: PropTypes.any,
  title: PropTypes.string.isRequired
};

export default Chips;
