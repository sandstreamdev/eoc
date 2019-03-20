import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _sortBy from 'lodash/sortBy';

import ItemsList from 'modules/list/components/ItemsList';
import SortBox from 'common/components/SortBox';
import { SortOrderType } from 'common/constants/enums';
import FilterBox from 'modules/list/components/FilterBox';
import { getCurrentUser } from 'modules/authorization/model/selectors';

const SortOptionType = Object.freeze({
  NAME: 'name',
  DATE: 'createdAt',
  AUTHOR: 'author',
  VOTES: 'votes'
});

export const FilterOptionType = Object.freeze({
  MY_ITEMS: 'my_items',
  ALL_ITEMS: 'all_items'
});

const sortOptions = [
  { id: SortOptionType.AUTHOR, label: 'author' },
  { id: SortOptionType.DATE, label: 'date' },
  { id: SortOptionType.NAME, label: 'name' },
  { id: SortOptionType.VOTES, label: 'votes' }
];

const filterOptions = [
  { id: FilterOptionType.ALL_ITEMS, label: 'all' },
  { id: FilterOptionType.MY_ITEMS, label: 'my' }
];

class ItemsContainer extends Component {
  state = {
    sortBy: SortOptionType.DATE,
    sortOrder: SortOrderType.DESCENDING,
    filterBy: FilterOptionType.ALL_ITEMS
  };

  onSortChange = (sortBy, sortOrder) => this.setState({ sortBy, sortOrder });

  sortItems = (items, sortBy, sortOrder) => {
    let result = [...items];

    switch (sortBy) {
      case SortOptionType.NAME:
        result = _sortBy(result, item => item.name.toLowerCase());
        break;
      case SortOptionType.AUTHOR:
        result = _sortBy(result, [
          item => item.authorName.toLowerCase(),
          item => item.name.toLowerCase()
        ]);
        break;
      case SortOptionType.DATE:
        result.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA - dateB;
        });
        break;
      case SortOptionType.VOTES:
        result.sort((a, b) => a.voterIds.length - b.voterIds.length);
        break;
      default:
        break;
    }

    return sortOrder === SortOrderType.ASCENDING ? result : result.reverse();
  };

  onFilterChange = filterBy => this.setState({ filterBy });

  filterItems = (items, filterBy) => {
    const {
      currentUser: { id }
    } = this.props;

    return filterBy === FilterOptionType.MY_ITEMS
      ? items.filter(item => item.authorId === id)
      : items;
  };

  render() {
    const { archived, children, description, name, items } = this.props;
    const { filterBy, sortBy, sortOrder } = this.state;
    const filteredList = this.filterItems(items, filterBy);
    const sortedList = this.sortItems(filteredList, sortBy, sortOrder);

    return (
      <div className="items">
        <header className="items__header">
          <h2 className="items__heading items__heading--left">
            {archived ? 'Done' : name}
          </h2>
          <div className="items__header-controls">
            <FilterBox
              filterBy={filterBy}
              label="Filter by:"
              onChange={this.onFilterChange}
              options={filterOptions}
            />
            <SortBox
              label="Sort by:"
              onChange={this.onSortChange}
              options={sortOptions}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>
        </header>
        {children}
        {description && <p className="items__description">{description}</p>}
        <div className="items__body">
          <ItemsList archived={archived} items={sortedList} />
        </div>
      </div>
    );
  }
}

ItemsContainer.propTypes = {
  archived: PropTypes.bool,
  children: PropTypes.node,
  currentUser: PropTypes.objectOf(PropTypes.string).isRequired,
  description: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(mapStateToProps)(ItemsContainer);
