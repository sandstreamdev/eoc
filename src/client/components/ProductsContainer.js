import React from 'react';
import PropTypes from 'prop-types';

import ProductsList from './ProductsList';
import SortBox from './SortBox';

const ProductsContainer = ({ archived = false, handleSort, products }) => (
  <div className="products">
    <header className="products__header">
      <h2 className="products__heading">
        {archived ? 'Orders history' : 'Products list'}
      </h2>
      <SortBox handleSort={handleSort} archived={archived} />
    </header>
    <ProductsList archived={archived} products={products} />
  </div>
);

ProductsContainer.propTypes = {
  archived: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.object),

  handleSort: PropTypes.func.isRequired
};

export default ProductsContainer;
