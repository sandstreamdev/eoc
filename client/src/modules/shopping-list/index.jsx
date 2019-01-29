import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import MessageBox from 'common/components/MessageBox';
import ProductsContainer from 'modules/shopping-list/components/ProductsContainer';
import Preloader from 'common/components/Preloader';
import { StatusType, MessageType } from 'common/constants/enums';
import {
  getFetchStatus,
  getProducts
} from 'modules/shopping-list/model/selectors';
import InputBar from 'modules/shopping-list/components/InputBar';
import { StatusPropType } from 'common/constants/propTypes';
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
    const { fetchStatus, products } = this.props;
    const reversedProducts = [...products].reverse();
    const archiveList = reversedProducts.filter(product => product.isOrdered);
    const shoppingList = reversedProducts.filter(product => !product.isOrdered);

    return (
      <Fragment>
        <div
          className={classNames('app-wrapper', {
            overlay: fetchStatus === StatusType.PENDING
          })}
        >
          {fetchStatus === StatusType.ERROR && (
            <MessageBox
              message="Fetching failed. Try to refresh the page."
              type={MessageType.ERROR}
            />
          )}
          <InputBar />
          <ProductsContainer products={shoppingList} />
          <ProductsContainer archived products={archiveList} />
          {fetchStatus === StatusType.PENDING && (
            <Preloader message="Fetching data..." />
          )}
        </div>
      </Fragment>
    );
  }
}

ShoppingList.propTypes = {
  fetchStatus: StatusPropType.isRequired,
  products: PropTypes.arrayOf(PropTypes.object),

  fetchProducts: PropTypes.func
};

const mapStateToProps = state => ({
  fetchStatus: getFetchStatus(state),
  products: getProducts(state)
});

export default connect(
  mapStateToProps,
  { fetchProducts }
)(ShoppingList);
