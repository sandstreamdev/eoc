import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { PlusIcon } from 'assets/images/icons';

export const CardColorType = {
  BROWN: 'card/BROWN',
  ORANGE: 'card/ORANGE'
};

const CardItem = ({ color, description, name, withPlus }) => (
  <div
    className={classNames('card-item', {
      'card-item--orange': color === CardColorType.ORANGE,
      'card-item--brown': color === CardColorType.BROWN,
      'card-item__plus': withPlus
    })}
  >
    {withPlus ? (
      <Fragment>
        <h3 className="card-item__heading-plus">Add new</h3>
        <PlusIcon />
      </Fragment>
    ) : (
      <Fragment>
        <h3 className="card-item__heading">{name}</h3>
        <p className="card-item__description">{description}</p>
      </Fragment>
    )}
  </div>
);

export default CardItem;

CardItem.propTypes = {
  color: PropTypes.string.isRequired,
  description: PropTypes.string,
  name: PropTypes.string,
  withPlus: PropTypes.bool
};
