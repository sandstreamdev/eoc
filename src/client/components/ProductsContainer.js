import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProductsList from './ProductsList';
import SortBox from './SortBox';
import { sortList } from '../utils/sortLists';

class ProductsContainer extends Component {
  handleSort = (key, order) => {
    const direction = order ? 'ascending' : 'descending';
    const { products } = this.props;
    console.log(sortList(products, key, order));
  };

  render() {
    const { archived = false, handleSort, products } = this.props;

    return (
      <div className="products">
        <header className="products__header">
          <h2 className="products__heading">
            {archived ? 'Orders history' : 'Products list'}
          </h2>
          <SortBox handleSort={this.handleSort} />
        </header>
        <ProductsList archived={archived} products={products} />
      </div>
    );
  }
}

ProductsContainer.propTypes = {
  archived: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.object),

  handleSort: PropTypes.func.isRequired
};

export default ProductsContainer;
