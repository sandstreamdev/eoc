import React from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';

import CardItem from 'common/components/CardItem';
import CardPlus from 'common/components/CardPlus';

const GridList = ({
  color,
  items,
  onAddNew,
  onCardClick,
  onFavClick,
  route
}) => (
  <ul className="tiles-mode">
    {onAddNew && (
      <li className="tiles-mode__item">
        <button className="tiles-mode__button" onClick={onAddNew} type="button">
          <CardPlus />
        </button>
      </li>
    )}
    {_map(items, item => (
      <li className="tiles-mode__item" key={item._id}>
        <CardItem
          color={color}
          item={item}
          onCardClick={onCardClick(route, item._id)}
          onFavClick={onFavClick(item._id, item.isFavourite)}
          route={route}
        />
      </li>
    ))}
  </ul>
);

GridList.propTypes = {
  color: PropTypes.string.isRequired,
  items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  route: PropTypes.string.isRequired,

  onAddNew: PropTypes.func,
  onCardClick: PropTypes.func.isRequired,
  onFavClick: PropTypes.func.isRequired
};

export default GridList;
