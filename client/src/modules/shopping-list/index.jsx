import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ProductsContainer from 'modules/shopping-list/components/ProductsContainer';
import { getProducts } from 'modules/shopping-list/model/selectors';
import InputBar from 'modules/shopping-list/components/InputBar';
import { fetchProducts } from 'modules/shopping-list/model/actions';

class ShoppingList extends Component {
  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = () => {
    const { fetchProducts } = this.props;
    fetchProducts();
  };

  render() {
    const { products } = this.props;

    const archiveList = products.filter(product => product.isOrdered);
    const shoppingList = products.filter(product => !product.isOrdered);

    return (
      <Fragment>
        <div className="app-wrapper">
          <InputBar />
          <ProductsContainer products={shoppingList} />
          <ProductsContainer archived products={archiveList} />
        </div>
      </Fragment>
    );
  }
}

ShoppingList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),

  fetchProducts: PropTypes.func
};

const mapStateToProps = state => ({
  products: getProducts(state)
});

export default connect(
  mapStateToProps,
  { fetchProducts }
)(ShoppingList);
