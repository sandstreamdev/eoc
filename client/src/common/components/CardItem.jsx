import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { RegularStarIcon, SolidStarIcon, LockIcon } from 'assets/images/icons';

export const CardColorType = {
  BROWN: 'card/BROWN',
  ARCHIVED: 'card/GRAY',
  ORANGE: 'card/ORANGE'
};

const CardItem = ({
  color,
  description,
  isFavourite,
  isPrivate,
  name,
  onCardClick,
  onFavClick
}) => (
  <div
    className={classNames('card-item', {
      'card-item--orange': color === CardColorType.ORANGE,
      'card-item--archived': color === CardColorType.ARCHIVED,
      'card-item--brown': color === CardColorType.BROWN
    })}
    onClick={onCardClick}
    role="figure"
  >
    <header className="card-item__header">
      {isPrivate && <LockIcon />}
      <h3 className="card-item__heading">{name}</h3>
    </header>
    <p className="card-item__description">{description}</p>
    <button className="card-item__star" onClick={onFavClick} type="button">
      {isFavourite ? <SolidStarIcon /> : <RegularStarIcon />}
    </button>
  </div>
);

export default CardItem;

CardItem.propTypes = {
  color: PropTypes.string.isRequired,
  description: PropTypes.string,
  isFavourite: PropTypes.bool,
  isPrivate: PropTypes.bool,
  name: PropTypes.string,

  onCardClick: PropTypes.func.isRequired,
  onFavClick: PropTypes.func
};
