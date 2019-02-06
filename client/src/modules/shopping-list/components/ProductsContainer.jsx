import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _sortBy from 'lodash/sortBy';

import ProductsList from 'modules/shopping-list/components/ProductsList';
import SortBox from 'common/components/SortBox';
import { SortOrderType } from 'common/constants/enums';
import FilterBox from 'modules/shopping-list/components/FilterBox';
import { getCurrentUser } from 'modules/authorization/model/selectors';

const SortOptionType = Object.freeze({
  NAME: 'name',
  DATE: 'createdAt',
  AUTHOR: 'author',
  VOTES: 'votes'
});

export const FilterOptionType = Object.freeze({
  MY_PRODUCTS: 'my_products',
  ALL_PRODUCTS: 'all_products'
});

const sortOptions = [
  { id: SortOptionType.AUTHOR, label: 'author' },
  { id: SortOptionType.DATE, label: 'date' },
  { id: SortOptionType.NAME, label: 'name' },
  { id: SortOptionType.VOTES, label: 'votes' }
];

const filterOptions = [
  { id: FilterOptionType.ALL_PRODUCTS, label: 'all products' },
  { id: FilterOptionType.MY_PRODUCTS, label: 'my products' }
];

class ProductsContainer extends Component {
  state = {
    sortBy: SortOptionType.NAME,
    sortOrder: SortOrderType.ASCENDING,
    filterBy: FilterOptionType.ALL_PRODUCTS
  };

  onSortChange = (sortBy, sortOrder) => this.setState({ sortBy, sortOrder });

  sortProducts = (products, sortBy, sortOrder) => {
    let result = [...products];

    switch (sortBy) {
      case SortOptionType.NAME:
        result = _sortBy(result, product => product.name.toLowerCase());
        break;
      case SortOptionType.AUTHOR:
        result = _sortBy(result, [
          product => product.authorName.toLowerCase(),
          product => product.name.toLowerCase()
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
        result.sort((a, b) => a.votes.length - b.votes.length);
        break;
      default:
        break;
    }

    return sortOrder === SortOrderType.ASCENDING ? result : result.reverse();
  };

  onFilterChange = filterBy => this.setState({ filterBy });

  filterProducts = (products, filterBy) => {
    const {
      currentUser: { id }
    } = this.props;

    return filterBy === FilterOptionType.MY_PRODUCTS
      ? products.filter(product => product.authorId === id)
      : products;
  };

  render() {
    const { archived, products } = this.props;
    const { filterBy, sortBy, sortOrder } = this.state;
    const filteredList = this.filterProducts(products, filterBy);
    const sortedList = this.sortProducts(filteredList, sortBy, sortOrder);

    return (
      <div className="products">
        <header className="products__header">
          <h2 className="products__heading">
            {archived ? 'History' : 'Items'}
          </h2>
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
        </header>
        <ProductsList archived={archived} products={sortedList} />
      </div>
    );
  }
}

ProductsContainer.propTypes = {
  archived: PropTypes.bool,
  currentUser: PropTypes.objectOf(PropTypes.string).isRequired,
  products: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(mapStateToProps)(ProductsContainer);
