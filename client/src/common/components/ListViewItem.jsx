import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import { RegularStarIcon, SolidStarIcon, LockIcon } from 'assets/images/icons';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { ListType } from 'modules/list/consts';
import { ColorType, Routes } from 'common/constants/enums';
import { IntlPropType } from 'common/constants/propTypes';

class ListViewItem extends PureComponent {
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
      <div className="list-view-item" onClick={onCardClick} role="figure">
        <div
          className={classNames('list-view-item__lock', {
            'list-view-item__lock--orange': color === ColorType.ORANGE,
            'list-view-item__lock--gray': color === ColorType.GRAY
          })}
        >
          {isLimitedList && <LockIcon />}
        </div>
        <div className="list-view-item__details">
          <header
            className={classNames('list-view-item__header', {
              'list-view-item__header--no-description': !description
            })}
          >
            <h3 className="list-view-item__heading">{name}</h3>
            {description && (
              <p className="list-view-item__description">{description}</p>
            )}
          </header>
          <div className="list-view-item__data">
            <FormattedMessage
              id="common.list-view-item.done"
              values={{ doneItemsCount }}
            />
            <FormattedMessage
              id="common.list-view-item.unhandled"
              values={{ unhandledItemsCount }}
            />
          </div>
        </div>
        {route !== Routes.COHORT && (
          <button
            className={classNames('list-view-item__star', {
              'list-view-item__star--orange': color === ColorType.ORANGE,
              'list-view-item__star--gray': color === ColorType.GRAY
            })}
            disabled={pending}
            onClick={this.handleFavClick}
            title={
              isFavourite
                ? formatMessage({
                    id: 'common.list-view-item.remove-fav'
                  })
                : formatMessage({
                    id: 'common.list-view-item.add-fav'
                  })
            }
            type="button"
          >
            {isFavourite ? <SolidStarIcon /> : <RegularStarIcon />}
            {pending && (
              <div className="list-view-item__preloader">
                <Preloader size={PreloaderSize.SMALL} />
              </div>
            )}
          </button>
        )}
      </div>
    );
  }
}

ListViewItem.propTypes = {
  color: PropTypes.string.isRequired,
  intl: IntlPropType.isRequried,
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  route: PropTypes.string.isRequired,

  onCardClick: PropTypes.func.isRequired,
  onFavClick: PropTypes.func
};

export default injectIntl(ListViewItem);
