import React from 'react';
import PropTypes from 'prop-types';

const CardItem = ({ name }) => (
  <a className="card-item" href="#!">
    <h3 className="card-item__heading">{name}</h3>
  </a>
);

export default CardItem;

CardItem.propTypes = {
  name: PropTypes.string
};
