import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';

import CardItem from 'common/components/CardItem';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import CardPlus from 'common/components/CardPlus';
import Preloader from 'common/components/Preloader';

class ListMode extends PureComponent {
  render() {
    const {
      color,
      items,
      onAddNew,
      onCardClick,
      onFavClick,
      pending,
      placeholder,
      route
    } = this.props;

    return (
      <Fragment>
        <ul className="list-mode__list">
          {onAddNew && (
            <li className="list-mode__item">
              <button
                className="list-mode__button"
                onClick={onAddNew}
                type="button"
              >
                <CardPlus />
              </button>
            </li>
          )}
          {_map(items, item => (
            <li className="list-mode__item" key={item._id}>
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
        {pending && <Preloader />}
        {_isEmpty(items) && (
          <MessageBox message={placeholder} type={MessageType.INFO} />
        )}
      </Fragment>
    );
  }
}

ListMode.propTypes = {
  color: PropTypes.string.isRequired,
  items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  pending: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,

  onAddNew: PropTypes.func,
  onCardClick: PropTypes.func.isRequired,
  onFavClick: PropTypes.func.isRequired
};

export default ListMode;
