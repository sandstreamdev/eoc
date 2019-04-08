import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { RegularStarIcon, SolidStarIcon, LockIcon } from 'assets/images/icons';
import { Routes } from 'common/constants/enums';

export const CardColorType = {
  BROWN: 'card/BROWN',
  ARCHIVED: 'card/GRAY',
  ORANGE: 'card/ORANGE'
};

const CardItem = ({
  color,
  description,
  doneItemsCount,
  isFavourite,
  isPrivate,
  name,
  onCardClick,
  onFavClick,
  route,
  unhandledItemsCount
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
    {route === Routes.LIST && (
      <div className="card-item__data">
        <span>{`Done: ${doneItemsCount}`}</span>
        <span>{`Unhandled: ${unhandledItemsCount}`}</span>
      </div>
    )}
  </div>
);

export default CardItem;

CardItem.propTypes = {
  color: PropTypes.string.isRequired,
  description: PropTypes.string,
  doneItemsCount: PropTypes.number,
  isFavourite: PropTypes.bool,
  isPrivate: PropTypes.bool,
  name: PropTypes.string,
  route: PropTypes.string.isRequired,
  unhandledItemsCount: PropTypes.number,

  onCardClick: PropTypes.func.isRequired,
  onFavClick: PropTypes.func
};
