import React from 'react';
import PropTypes from 'prop-types';

import ProductsList from './ProductsList';

const ProductsContainer = ({ archived, products }) => (
  <div className="products">
    <header className="products__header">
      <h2 className="products__heading">
        {archived ? 'Orders history' : 'Products list'}
      </h2>
      <span className="products__info">
        {archived ? 'Restore item' : 'Mark as ordered'}
      </span>
    </header>
    <ProductsList archived={archived} products={products} />
  </div>
);

ProductsContainer.propTypes = {
  archived: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.object)
};

export default ProductsContainer;
