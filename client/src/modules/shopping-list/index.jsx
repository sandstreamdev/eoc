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
  getShoppingList
} from 'modules/shopping-list/model/selectors';
import InputBar from 'modules/shopping-list/components/InputBar';
import { StatusPropType } from 'common/constants/propTypes';
import { fetchProductsFromGivenList } from 'modules/shopping-list/model/actions';

class ShoppingList extends Component {
  componentDidMount() {
    this.fetchProducts();
  }

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
    const { fetchStatus, list } = this.props;
    const listItems = list && list.products ? list.products : [];
    const archiveList = listItems.filter(product => product.isOrdered);
    const shoppingList = listItems.filter(product => !product.isOrdered);

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
  list: PropTypes.objectOf(PropTypes.any),

  fetchProductsFromGivenList: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: getFetchStatus(state),
  list: getShoppingList(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    { fetchProductsFromGivenList }
  )(ShoppingList)
);
