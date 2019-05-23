import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

import GridList from 'common/components/GridList';
import ListMode from 'common/components/ListMode';
import { MessageType, Routes } from 'common/constants/enums';
import {
  addListToFavourites,
  removeListFromFavourites
} from 'modules/list/model/actions';
import {
  addCohortToFavourites,
  removeCohortFromFavourites
} from 'modules/cohort/model/actions';
import MessageBox from 'common/components/MessageBox';
import Preloader from 'common/components/Preloader';

class Elements extends PureComponent {
  handleFavClick = (itemId, isFavourite) => event => {
    event.stopPropagation();
    const {
      addCohortToFavourites,
      addListToFavourites,
      removeCohortFromFavourites,
      removeListFromFavourites,
      route
    } = this.props;

    let action;
    switch (route) {
      case Routes.LIST:
        action = isFavourite ? removeListFromFavourites : addListToFavourites;
        break;
      case Routes.COHORT:
        action = isFavourite
          ? removeCohortFromFavourites
          : addCohortToFavourites;
        break;
      default:
        break;
    }
    return action(itemId);
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
      listMode,
      name,
      onAddNew,
      pending,
      placeholder,
      route
    } = this.props;

    return (
      <div className="elements">
        <h2 className="elements__heading">
          {icon}
          {name}
        </h2>
        <div className="elements__body">
          {listMode ? (
            <ListMode
              color={color}
              items={items}
              onAddNew={onAddNew}
              onCardClick={this.handleCardClick}
              onFavClick={this.handleFavClick}
              pending={pending}
              placeholder={placeholder}
              route={route}
            />
          ) : (
            <GridList
              color={color}
              items={items}
              onAddNew={onAddNew}
              onCardClick={this.handleCardClick}
              onFavClick={this.handleFavClick}
              pending={pending}
              placeholder={placeholder}
              route={route}
            />
          )}
          {pending && <Preloader />}
          {_isEmpty(items) && !pending && (
            <MessageBox message={placeholder} type={MessageType.INFO} />
          )}
        </div>
      </div>
    );
  }
}

Elements.propTypes = {
  color: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  icon: PropTypes.node.isRequired,
  items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  listMode: PropTypes.bool,
  name: PropTypes.string.isRequired,
  pending: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,

  addCohortToFavourites: PropTypes.func,
  addListToFavourites: PropTypes.func,
  onAddNew: PropTypes.func,
  removeCohortFromFavourites: PropTypes.func,
  removeListFromFavourites: PropTypes.func
};

export default withRouter(
  connect(
    null,
    {
      addCohortToFavourites,
      addListToFavourites,
      removeCohortFromFavourites,
      removeListFromFavourites
    }
  )(Elements)
);
