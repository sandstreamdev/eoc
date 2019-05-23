import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { RegularStarIcon, SolidStarIcon, LockIcon } from 'assets/images/icons';
import { ColorType, Routes } from 'common/constants/enums';
import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';
import { ListType } from 'modules/list';

class CardItem extends PureComponent {
  state = {
    pending: false
  };

  handleFavClick = event => {
    const { onFavClick } = this.props;

    this.setState({ pending: true });

    onFavClick(event).finally(() => this.setState({ pending: false }));
  };

  render() {
    const {
      color,
      item: {
        description,
        doneItemsCount,
        isFavourite,
        membersCount,
        name,
        type,
        unhandledItemsCount
      },
      onCardClick,
      route
    } = this.props;
    const { pending } = this.state;
    const isLimitedList = type === ListType.LIMITED;

    return (
      <div
        className={classNames('card-item', {
          'card-item--orange': color === ColorType.ORANGE,
          'card-item--archived': color === ColorType.GRAY,
          'card-item--brown': color === ColorType.BROWN
        })}
        onClick={onCardClick}
        role="figure"
      >
        <header className="card-item__header">
          {isLimitedList && <LockIcon />}
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
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  route: PropTypes.string.isRequired,

  onCardClick: PropTypes.func.isRequired,
  onFavClick: PropTypes.func
};
