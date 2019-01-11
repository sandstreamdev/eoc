import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _sortBy from 'lodash/sortBy';

import ProductsList from './ProductsList';
import SortBox from './SortBox';
import { SortOrderType } from '../common/enums';

const SortOptionType = Object.freeze({
  NAME: 'name',
  DATE: 'createdAt',
  AUTHOR: 'author'
});

const sortOptions = [
  { id: SortOptionType.AUTHOR, label: 'author' },
  { id: SortOptionType.DATE, label: 'date' },
  { id: SortOptionType.NAME, label: 'name' }
];

class ProductsContainer extends Component {
  state = {
    sortBy: SortOptionType.NAME,
    sortOrder: SortOrderType.ASCENDING
  };

  onSortChange = (sortBy, sortOrder) => {
    this.setState({
      sortBy,
      sortOrder
    });
  };

  sortProducts = (products, sortBy, sortOrder) => {
    let result = [...products];

    switch (sortBy) {
      case SortOptionType.NAME:
        result = _sortBy(result, item => item.name.toLowerCase());
        break;
      case SortOptionType.AUTHOR:
        result = _sortBy(result, [
          item => item.author.toLowerCase(),
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

  render() {
    const { archived, products } = this.props;
    const { sortBy, sortOrder } = this.state;
    const sortedList = this.sortProducts(products, sortBy, sortOrder);

    return (
      <div className="products">
        <header className="products__header">
          <h2 className="products__heading">
            {archived ? 'Orders history' : 'Products list'}
          </h2>
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
  products: PropTypes.arrayOf(PropTypes.object)
};

export default ProductsContainer;
