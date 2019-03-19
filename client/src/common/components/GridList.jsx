import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';

import CardItem from 'common/components/CardItem';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import CardPlus from 'common/components/CardPlus';

const GridList = ({
  color,
  description,
  icon,
  items,
  name,
  onAddNew,
  placeholder,
  route
}) => (
  <div className="grid-list">
    <h2 className="grid-list__heading">
      {icon}
      {name}
    </h2>
    {description && <p className="grid-list__description">{description}</p>}
    <div className="grid-list__body">
      <ul className="grid-list__list">
        {onAddNew && (
          <li className="grid-list__item">
            <button
              className="grid-list__button"
              onClick={onAddNew}
              type="button"
            >
              <CardPlus />
            </button>
          </li>
        )}
        {_map(items, item => (
          <li className="grid-list__item" key={item._id}>
            <Link to={`/${route}/${item._id}`}>
              <CardItem
                color={color}
                description={item.description}
                name={item.name}
              />
            </Link>
          </li>
        ))}
      </ul>
      {_isEmpty(items) && (
        <MessageBox message={placeholder} type={MessageType.INFO} />
      )}
    </div>
  </div>
);

GridList.propTypes = {
  color: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.node.isRequired,
  items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,

  onAddNew: PropTypes.func
};

export default GridList;
