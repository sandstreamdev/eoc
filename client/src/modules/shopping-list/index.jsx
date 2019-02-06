import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

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
import {
  fetchProductsFromGivenList,
  fetchShoppingLists
} from 'modules/shopping-list/model/actions';

class ShoppingList extends Component {
  componentDidMount() {
    this.fetchProducts();
    this.fetchLists();
  }

  fetchLists = () => {
    const { fetchShoppingLists } = this.props;
    fetchShoppingLists();
  };

  fetchProducts = () => {
    const {
      fetchProductsFromGivenList,
      match: {
        params: { id }
      }
    } = this.props;
    fetchProductsFromGivenList(id);
  };

  render() {
    const { fetchStatus } = this.props;

    const archiveList = [].filter(product => product.isOrdered);
    const shoppingList = [].filter(product => !product.isOrdered);

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
  match: PropTypes.objectOf(PropTypes.any),
  products: PropTypes.arrayOf(PropTypes.object),

  fetchProductsFromGivenList: PropTypes.func,
  fetchShoppingLists: PropTypes.func
};

const mapStateToProps = state => ({
  fetchStatus: getFetchStatus(state),
  products: getProducts(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    { fetchProductsFromGivenList, fetchShoppingLists }
  )(ShoppingList)
);
