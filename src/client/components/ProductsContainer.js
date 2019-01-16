import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _sortBy from 'lodash/sortBy';

import ProductsList from './ProductsList';
import SortBox from './SortBox';
import { SortOrderType } from '../common/enums';
import FilterBox from './FilterBox';
import { getCurrentUser } from '../selectors';

const SortOptionType = Object.freeze({
  NAME: 'name',
  DATE: 'createdAt',
  AUTHOR: 'author'
});

export const FilterOptionType = Object.freeze({
  MY_PRODUCTS: 'my_products',
  ALL_PRODUCTS: 'all_products'
});

const sortOptions = [
  { id: SortOptionType.AUTHOR, label: 'author' },
  { id: SortOptionType.DATE, label: 'date' },
  { id: SortOptionType.NAME, label: 'name' }
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
      ? products.filter(item => item.authorId === id)
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
            {archived ? 'Orders history' : 'Products list'}
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
