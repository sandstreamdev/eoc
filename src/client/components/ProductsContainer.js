import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _sortBy from 'lodash/sortBy';

import ProductsList from './ProductsList';
import SortBox from './SortBox';
import { OptionType } from '../common/enums';

// FIXME: Where to place options in project stucture?
const options = [
  { id: OptionType.AUTHOR, label: 'author' },
  { id: OptionType.DATE, label: 'date' },
  { id: OptionType.NAME, label: 'name' }
];

class ProductsContainer extends Component {
  state = {
    sortBy: '',
    order: false
  };

  onSortChange = (sortBy, order) => {
    this.setState({
      sortBy,
      order
    });
  };

  sortProducts = (products, sortBy, order) => {
    let result = [...products];

    switch (sortBy) {
      case OptionType.NAME:
        result = _sortBy(result, item => item.name.toLowerCase());
        break;
      case OptionType.AUTHOR:
        result = _sortBy(result, [
          item => item.author.toLowerCase(),
          item => item.name.toLowerCase()
        ]);
        break;

      case OptionType.DATE:
        result.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA - dateB;
        });
        break;
      default:
        break;
    }

    return order ? result : result.reverse();
  };

  render() {
    const { archived, products } = this.props;
    const { sortBy, order } = this.state;
    const sortedList = this.sortProducts(products, sortBy, order);

    return (
      <div className="products">
        <header className="products__header">
          <h2 className="products__heading">
            {archived ? 'Orders history' : 'Products list'}
          </h2>
          <SortBox
            label="Sort by:"
            onChange={this.onSortChange}
            options={options}
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
