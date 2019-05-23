import React from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';

import ListModeItem from 'common/components/ListModeItem';
import CardPlus from 'common/components/CardPlus';

const ListMode = ({
  color,
  items,
  onAddNew,
  onCardClick,
  onFavClick,
  route
}) => (
  <ul className="list-mode__list">
    {onAddNew && (
      <li className="list-mode__item">
        <button className="list-mode__button" onClick={onAddNew} type="button">
          <CardPlus />
        </button>
      </li>
    )}
    {_map(items, item => (
      <li className="list-mode__item" key={item._id}>
        <ListModeItem
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

ListMode.propTypes = {
  color: PropTypes.string.isRequired,
  items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  route: PropTypes.string.isRequired,

  onAddNew: PropTypes.func,
  onCardClick: PropTypes.func.isRequired,
  onFavClick: PropTypes.func.isRequired
};

export default ListMode;
