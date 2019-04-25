import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { RegularStarIcon, SolidStarIcon, LockIcon } from 'assets/images/icons';
import { Routes } from 'common/constants/enums';
import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';

export const CardColorType = {
  BROWN: 'card/BROWN',
  ARCHIVED: 'card/GRAY',
  ORANGE: 'card/ORANGE'
};

class CardItem extends PureComponent {
  state = {
    pending: false
  };

  handleFavClick = e => {
    const { onFavClick } = this.props;

    this.setState({ pending: true });

    onFavClick(e).finally(() => {
      this.setState({ pending: false });
    });
  };

  render() {
    const {
      color,
      description,
      doneItemsCount,
      isFavourite,
      isPrivate,
      membersCount,
      name,
      onCardClick,
      route,
      unhandledItemsCount
    } = this.props;

    const { pending } = this.state;

    return (
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
        <button
          className="card-item__star"
          disabled={pending}
          onClick={this.handleFavClick}
          type="button"
        >
          {isFavourite ? <SolidStarIcon /> : <RegularStarIcon />}
          {pending && (
            <div className="card-item__preloader">
              <Preloader
                size={PreloaderSize.SMALL}
                theme={PreloaderTheme.LIGHT}
              />
            </div>
          )}
        </button>
        <div className="card-item__data">
          {route === Routes.LIST ? (
            <Fragment>
              <span>{`Done: ${doneItemsCount}`}</span>
              <span>{`Unhandled: ${unhandledItemsCount}`}</span>
            </Fragment>
          ) : (
            <span>{`Members: ${membersCount}`}</span>
          )}
        </div>
      </div>
    );
  }
}

export default CardItem;

CardItem.propTypes = {
  color: PropTypes.string.isRequired,
  description: PropTypes.string,
  doneItemsCount: PropTypes.number,
  isFavourite: PropTypes.bool,
  isPrivate: PropTypes.bool,
  membersCount: PropTypes.number,
  name: PropTypes.string,
  route: PropTypes.string.isRequired,
  unhandledItemsCount: PropTypes.number,

  onCardClick: PropTypes.func.isRequired,
  onFavClick: PropTypes.func
};
