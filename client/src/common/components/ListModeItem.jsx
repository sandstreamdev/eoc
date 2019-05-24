import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { RegularStarIcon, SolidStarIcon, LockIcon } from 'assets/images/icons';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { ListType } from 'modules/list/consts';
import { ColorType } from 'common/constants/enums';

class ListModeItem extends PureComponent {
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
        name,
        type,
        unhandledItemsCount
      },
      onCardClick
    } = this.props;
    const { pending } = this.state;
    const isLimitedList = type === ListType.LIMITED;

    return (
      <div className="list-mode-item" onClick={onCardClick} role="figure">
        <div
          className={classNames('list-mode-item__lock', {
            'list-mode-item__lock--orange': color === ColorType.ORANGE,
            'list-mode-item__lock--archived': color === ColorType.GRAY
          })}
        >
          {isLimitedList && <LockIcon />}
        </div>
        <div className="list-mode-item__details">
          <header className="list-mode-item__header">
            <h3 className="list-mode-item__heading">{name}</h3>
            {description && (
              <p className="list-mode-item__description">{description}</p>
            )}
          </header>
          <div className="list-mode-item__data">
            <span>{`Done: ${doneItemsCount}`}</span>
            <span>{`Unhandled: ${unhandledItemsCount}`}</span>
          </div>
        </div>
        <button
          className={classNames('list-mode-item__star', {
            'list-mode-item__star--orange': color === ColorType.ORANGE,
            'list-mode-item__star--archived': color === ColorType.GRAY
          })}
          disabled={pending}
          onClick={this.handleFavClick}
          type="button"
        >
          {isFavourite ? <SolidStarIcon /> : <RegularStarIcon />}
          {pending && (
            <div className="list-mode-item__preloader">
              <Preloader size={PreloaderSize.SMALL} />
            </div>
          )}
        </button>
      </div>
    );
  }
}

ListModeItem.propTypes = {
  color: PropTypes.string.isRequired,
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,

  onCardClick: PropTypes.func.isRequired,
  onFavClick: PropTypes.func
};

export default ListModeItem;
