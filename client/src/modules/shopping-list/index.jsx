import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ProductsContainer from 'modules/shopping-list/components/ProductsContainer';
import { getProducts } from 'modules/shopping-list/model/selectors';
import InputBar from 'modules/shopping-list/components/InputBar';
import { fetchProducts } from 'modules/shopping-list/model/actions';
import DropdownMenu from 'common/components/DropdownMenu';
import EditIcon from 'assets/images/pen-solid.svg';
import RemoveIcon from 'assets/images/trash-alt-solid.svg';
import InviteUserIcon from 'assets/images/user-plus-solid.svg';

class ShoppingList extends Component {
  shoppingListMenu = [
    { label: 'Edit list', icon: EditIcon, callback: () => {} },
    { label: 'Remove list', icon: RemoveIcon, callback: () => {} },
    { label: 'invite user', icon: InviteUserIcon, callback: () => {} }
  ];

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
      <div className="app-wrapper">
        <InputBar />
        <ProductsContainer products={shoppingList}>
          <DropdownMenu menuItems={this.shoppingListMenu} />
        </ProductsContainer>
        <ProductsContainer archived products={archiveList} />
      </div>
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
