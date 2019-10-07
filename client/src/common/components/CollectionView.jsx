import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import _map from 'lodash/map';
import { none } from '@sandstreamdev/std/object';
import { connect } from 'react-redux';

import TilesViewItem from 'common/components/TilesViewItem';
import MessageBox from 'common/components/MessageBox';
import { MessageType, ViewType } from 'common/constants/enums';
import CardPlus from 'common/components/CardPlus';
import {
  addListToFavourites,
  removeListFromFavourites
} from 'modules/list/model/actions';
import Preloader from 'common/components/Preloader';
import ListViewItem from 'common/components/ListViewItem';
import './CollectionView.scss';

class CollectionView extends PureComponent {
  handleFavClick = (itemId, isFavourite, listName) => event => {
    event.stopPropagation();
    const { addListToFavourites, removeListFromFavourites } = this.props;

    const action = isFavourite ? removeListFromFavourites : addListToFavourites;

    return action(itemId, listName);
  };

  handleCardClick = (route, itemId) => () => {
    const { history } = this.props;
    history.push(`/${route}/${itemId}`);
  };

  renderAddNew = () => {
    const { label, onAddNew } = this.props;

    return (
      <li className="collection__item">
        <button className="collection__button" onClick={onAddNew} type="button">
          <CardPlus label={label} />
        </button>
      </li>
    );
  };

  renderAsList = () => {
    const { color, items, route } = this.props;

    return _map(items, item => {
      const { _id, isFavourite, name } = item;

      return (
        <li className="collection__item" key={_id}>
          <ListViewItem
            color={color}
            item={item}
            onCardClick={this.handleCardClick(route, _id)}
            onFavClick={this.handleFavClick(_id, isFavourite, name)}
            route={route}
          />
        </li>
      );
    });
  };

  renderAsTiles = () => {
    const { color, items, route } = this.props;

    return _map(items, item => {
      const { _id, isFavourite } = item;

      return (
        <li className="collection__item" key={_id}>
          <TilesViewItem
            color={color}
            item={item}
            onCardClick={this.handleCardClick(route, _id)}
            onFavClick={this.handleFavClick(_id, isFavourite)}
            route={route}
          />
        </li>
      );
    });
  };

  render() {
    const {
      icon,
      items,
      name,
      onAddNew,
      pending,
      placeholder,
      viewType
    } = this.props;

    return (
      <div className="collection">
        <h2 className="collection__heading">
          {icon}
          {name}
        </h2>
        <div className="collection__body">
          <ul
            className={
              viewType === ViewType.LIST
                ? 'collection__list'
                : 'collection__tiles'
            }
          >
            {onAddNew && this.renderAddNew()}
            {viewType === ViewType.LIST
              ? this.renderAsList()
              : this.renderAsTiles()}
          </ul>
          {pending && <Preloader />}
          {none(items) && !pending && (
            <MessageBox type={MessageType.INFO}>{placeholder}</MessageBox>
          )}
        </div>
      </div>
    );
  }
}

CollectionView.propTypes = {
  color: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  icon: PropTypes.node.isRequired,
  items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  pending: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  viewType: PropTypes.string.isRequired,

  addListToFavourites: PropTypes.func,
  onAddNew: PropTypes.func,
  removeListFromFavourites: PropTypes.func
};

export default withRouter(
  connect(
    null,
    {
      addListToFavourites,
      removeListFromFavourites
    }
  )(CollectionView)
);
