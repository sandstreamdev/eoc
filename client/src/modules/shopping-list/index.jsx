import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import ProductsContainer from 'modules/shopping-list/components/ProductsContainer';
import { getShoppingList } from 'modules/shopping-list/model/selectors';
import InputBar from 'modules/shopping-list/components/InputBar';
import { fetchItemsFromGivenList } from 'modules/shopping-list/model/actions';

class ShoppingList extends Component {
  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = () => {
    const {
      fetchItemsFromGivenList,
      match: {
        params: { id }
      }
    } = this.props;
    fetchItemsFromGivenList(id);
  };

  render() {
    const { list } = this.props;
    const listItems = list && list.products ? list.products : [];
    const archiveList = listItems.filter(item => item.isOrdered);
    const shoppingList = listItems.filter(item => !item.isOrdered);

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
  list: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,

  fetchItemsFromGivenList: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  list: getShoppingList(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    { fetchItemsFromGivenList }
  )(ShoppingList)
);
