import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import ItemsContainer from 'modules/list/components/ItemsContainer';
import { getArchivedItems } from 'modules/list/model/selectors';
import {
  disableAnimationForArchivedItems,
  fetchArchivedItems,
  removeArchivedItems
} from 'modules/list/components/Items/model/actions';
import { RouterMatchPropType, IntlPropType } from 'common/constants/propTypes';
import Preloader from 'common/components/Preloader';
import { getAnimationForArchived } from 'modules/list/components/Items/model/selectors';

class ArchivedItemsContainer extends PureComponent {
  state = {
    areArchivedItemsVisible: false,
    pending: false
  };

  handleArchivedItemsVisibility = () =>
    this.setState(
      ({ areArchivedItemsVisible }) => ({
        areArchivedItemsVisible: !areArchivedItemsVisible
      }),
      this.handleArchivedItemsData
    );

  handleArchivedItemsData = () => {
    const { areArchivedItemsVisible } = this.state;
    const {
      fetchArchivedItems,
      match: {
        params: { id: listId }
      },
      name,
      removeArchivedItems
    } = this.props;

    if (areArchivedItemsVisible) {
      this.setState({ pending: true });

      fetchArchivedItems(listId, name).finally(() =>
        this.setState({ pending: false })
      );
    } else {
      removeArchivedItems({ listId });
    }
  };

  render() {
    const { areArchivedItemsVisible, pending } = this.state;
    const {
      animate,
      archivedItems,
      disableAnimationForArchivedItems,
      intl: { formatMessage },
      isMember
    } = this.props;

    return (
      <div className="archived-items">
        <button
          className="link-button"
          onClick={this.handleArchivedItemsVisibility}
          type="button"
        >
          {areArchivedItemsVisible
            ? formatMessage({ id: 'list.archived-items-container.hide' })
            : formatMessage({ id: 'list.archived-items-container.show' })}
        </button>
        {areArchivedItemsVisible && (
          <div
            className={classNames('archived-items__items', {
              'archived-items__items--with-border': areArchivedItemsVisible
            })}
          >
            <ItemsContainer
              animate={animate}
              archived
              isMember={isMember}
              items={archivedItems}
              onDisableAnimations={disableAnimationForArchivedItems}
            />
            {pending && <Preloader />}
          </div>
        )}
      </div>
    );
  }
}

ArchivedItemsContainer.propTypes = {
  animate: PropTypes.bool,
  archivedItems: PropTypes.arrayOf(PropTypes.object),
  intl: IntlPropType.isRequired,
  isMember: PropTypes.bool,
  match: RouterMatchPropType.isRequired,
  name: PropTypes.string.isRequired,

  disableAnimationForArchivedItems: PropTypes.func.isRequired,
  fetchArchivedItems: PropTypes.func.isRequired,
  removeArchivedItems: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { id: listId }
    }
  } = ownProps;

  return {
    animate: getAnimationForArchived(state),
    archivedItems: getArchivedItems(state, listId)
  };
};

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    {
      disableAnimationForArchivedItems,
      fetchArchivedItems,
      removeArchivedItems
    }
  )
)(ArchivedItemsContainer);
