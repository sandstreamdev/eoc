import React from 'react';
import PropTypes from 'prop-types';

const CardItem = ({ name }) => (
  <div className="card-item" href="#!">
    <h3 className="card-item__heading">{name}</h3>
  </div>
);

export default CardItem;

CardItem.propTypes = {
  name: PropTypes.string
};
