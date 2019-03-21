import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { RegularStar, SolidStar } from 'assets/images/icons';

export const CardColorType = {
  BROWN: 'card/BROWN',
  ARCHIVED: 'card/GRAY',
  ORANGE: 'card/ORANGE'
};

const CardItem = ({ color, description, name }) => (
  <div
    className={classNames('card-item', {
      'card-item--orange': color === CardColorType.ORANGE,
      'card-item--archived': color === CardColorType.ARCHIVED,
      'card-item--brown': color === CardColorType.BROWN
    })}
  >
    <h3 className="card-item__heading">{name}</h3>
    <p className="card-item__description">{description}</p>
    <button
      className="card-item__star"
      onClick={e => console.log(e.target)}
      type="button"
    >
      <RegularStar />
    </button>
  </div>
);

export default CardItem;

CardItem.propTypes = {
  color: PropTypes.string.isRequired,
  description: PropTypes.string,
  name: PropTypes.string
};
