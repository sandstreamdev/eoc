import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';
import _isEqual from 'lodash/isEqual';

import ItemsList from 'modules/list/components/Items';
import { getCurrentUser } from 'modules/user/model/selectors';
import { IntlPropType } from 'common/constants/propTypes';
import './ItemsContainer.scss';
import Badge from 'common/components/Badge';
import { CloseIcon } from 'assets/images/icons';
import Filter from 'common/components/Filter';

class ItemsContainer extends Component {
  constructor(props) {
    super(props);

    const { items } = this.props;

    this.state = {
      items,
      displayedItemCount: items.length
    };
  }

  componentDidUpdate(previousProps) {
    const { items } = this.props;
    const { items: previousItems } = previousProps;

    if (!_isEqual(items, previousItems)) {
      this.updateItems();
    }
  }

  updateItems = () => {
    const { items } = this.props;

    this.setState({ items });
  };

  handleFilterLists = itemsToDisplay =>
    this.setState({ items: itemsToDisplay });

  handleDisplayItemsCount = displayedItemCount =>
    this.setState({ displayedItemCount });

  renderHeadingText = () => {
    const { archived, done } = this.props;

    if (archived) {
      return <FormattedMessage id="list.items-container.arch-items" />;
    }

    return (
      <FormattedMessage
        id={
          done ? 'list.items-container.done' : 'list.items-container.unhandled'
        }
      />
    );
  };

  render() {
    const {
      archived,
      children,
      intl: { formatMessage },
      isMember,
      items: itemsToSearch
    } = this.props;
    const { items, displayedItemCount } = this.state;
    const filterByFields = ['authorName', 'name'];
    const totalItemsCount = itemsToSearch.length;

    return (
      <div className="items">
        <header className="items__header">
          <h2 className="items__heading items__heading--left">
            {this.renderHeadingText()}
          </h2>
          <div className="items__header-controls">
            <Filter
              buttonContent={<CloseIcon />}
              filterBy={filterByFields}
              onFilter={this.handleFilterLists}
              options={itemsToSearch}
              placeholder={formatMessage({
                id: 'list.list-item.input-find-items'
              })}
            />
            <Badge
              count={displayedItemCount}
              total={totalItemsCount}
              context={formatMessage(
                { id: 'list.badge-items' },
                { total: totalItemsCount }
              )}
            />
          </div>
        </header>
        {children}
        <div className="items__body">
          <ItemsList
            archived={archived}
            isMember={isMember}
            items={items}
            onUpdateItemsCount={this.handleDisplayItemsCount}
          />
        </div>
      </div>
    );
  }
}

ItemsContainer.propTypes = {
  archived: PropTypes.bool,
  children: PropTypes.node,
  done: PropTypes.bool,
  intl: IntlPropType.isRequired,
  isMember: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(injectIntl, connect(mapStateToProps))(ItemsContainer);
