import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import { RegularStarIcon, SolidStarIcon, LockIcon } from 'assets/images/icons';
import { ColorType, Routes } from 'common/constants/enums';
import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';
import { ListType } from 'modules/list/consts';
import { IntlPropType } from 'common/constants/propTypes';
import './TilesViewItem.scss';

class TilesViewItem extends PureComponent {
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
      intl: { formatMessage },
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
        className={classNames('tiles-view-item', {
          'tiles-view-item--orange': color === ColorType.ORANGE,
          'tiles-view-item--gray': color === ColorType.GRAY,
          'tiles-view-item--brown': color === ColorType.BROWN
        })}
        onClick={onCardClick}
        role="figure"
      >
        <header className="tiles-view-item__header">
          {isLimitedList && (
            <LockIcon
              label={formatMessage({
                id: 'list.type.limited'
              })}
            />
          )}
          <h3 className="tiles-view-item__heading">{name}</h3>
        </header>
        <p className="tiles-view-item__description">{description}</p>
        {route !== Routes.COHORT && (
          <button
            className="tiles-view-item__star"
            disabled={pending}
            onClick={this.handleFavClick}
            title={
              isFavourite
                ? formatMessage({ id: 'common.tile-view-item.remove-fav' })
                : formatMessage({ id: 'common.tile-view-item.add-fav' })
            }
            type="button"
          >
            {isFavourite ? <SolidStarIcon /> : <RegularStarIcon />}
            {pending && (
              <div className="tiles-view-item__preloader">
                <Preloader
                  size={PreloaderSize.SMALL}
                  theme={PreloaderTheme.LIGHT}
                />
              </div>
            )}
          </button>
        )}
        <div className="tiles-view-item__data">
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

TilesViewItem.propTypes = {
  color: PropTypes.string.isRequired,
  intl: IntlPropType.isRequired,
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  route: PropTypes.string.isRequired,

  onCardClick: PropTypes.func.isRequired,
  onFavClick: PropTypes.func
};

export default injectIntl(TilesViewItem);
