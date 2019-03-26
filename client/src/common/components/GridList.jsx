import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';

import CardItem from 'common/components/CardItem';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import CardPlus from 'common/components/CardPlus';
import {
  addToFavourites,
  removeFromFavourites
} from 'modules/list/model/actions';

export const GridListRoutes = Object.freeze({
  COHORT: 'cohort',
  LIST: 'list'
});

class GridList extends PureComponent {
  handleFavClick = (itemId, isFavourite) => event => {
    event.stopPropagation();
    const { addToFavourites, removeFromFavourites, route } = this.props;

    if (route === GridListRoutes.LIST) {
      const action = isFavourite ? removeFromFavourites : addToFavourites;
      action(itemId);
    }
  };

  handleCardClick = (route, itemId) => () => {
    const { history } = this.props;
    history.push(`/${route}/${itemId}`);
  };

  render() {
    const {
      color,
      icon,
      items,
      name,
      onAddNew,
      placeholder,
      route
    } = this.props;

    return (
      <div className="grid-list">
        <h2 className="grid-list__heading">
          {icon}
          {name}
        </h2>
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
                <CardItem
                  color={color}
                  description={item.description}
                  isFavourite={item.isFavourite}
                  name={item.name}
                  onCardClick={this.handleCardClick(route, item._id)}
                  onFavClick={this.handleFavClick(item._id, item.isFavourite)}
                  route={route}
                />
              </li>
            ))}
          </ul>
          {_isEmpty(items) && (
            <MessageBox message={placeholder} type={MessageType.INFO} />
          )}
        </div>
      </div>
    );
  }
}

GridList.propTypes = {
  color: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  icon: PropTypes.node.isRequired,
  items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,

  addToFavourites: PropTypes.func,
  onAddNew: PropTypes.func,
  removeFromFavourites: PropTypes.func
};

export default withRouter(
  connect(
    null,
    { addToFavourites, removeFromFavourites }
  )(GridList)
);
