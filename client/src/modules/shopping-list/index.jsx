import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import ProductsContainer from 'modules/shopping-list/components/ProductsContainer';
import { getShoppingList } from 'modules/shopping-list/model/selectors';
import InputBar from 'modules/shopping-list/components/InputBar';
import {
  fetchItemsFromGivenList,
  deleteList
} from 'modules/shopping-list/model/actions';
import DropdownMenu from 'common/components/DropdownMenu';
import DialogBox from 'common/components/DialogBox';
import EditIcon from 'assets/images/pen-solid.svg';
import RemoveIcon from 'assets/images/trash-alt-solid.svg';
import InviteUserIcon from 'assets/images/user-plus-solid.svg';

class ShoppingList extends Component {
  state = {
    showDialogBox: false
  };

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

  showDialogBox = () => {
    this.setState({ showDialogBox: true });
  };

  hideDialogBox = () => {
    this.setState({ showDialogBox: false });
  };

  deleteListHandler = (id, redirectCallback) => () => {
    this.hideDialogBox();
    const { deleteList } = this.props;
    deleteList(id, redirectCallback);
  };

  redirectHandler = () => {
    const { history } = this.props;
    history.push('/dashboard');
  };

  render() {
    const { showDialogBox } = this.state;
    const {
      match: {
        params: { id: listId }
      },
      list
    } = this.props;
    const listItems = list && list.products ? list.products : [];
    const archiveList = listItems.filter(item => item.isOrdered);
    const shoppingList = listItems.filter(item => !item.isOrdered);
    const shoppingListMenu = [
      { callback: () => {}, icon: EditIcon, label: 'Edit list' },
      {
        callback: this.showDialogBox,
        icon: RemoveIcon,
        label: 'Remove list'
      },
      { callback: () => {}, icon: InviteUserIcon, label: 'invite user' }
    ];

    return (
      <Fragment>
        <div className="app-wrapper">
          <InputBar />
          <ProductsContainer products={shoppingList}>
            <DropdownMenu menuItems={shoppingListMenu} />
          </ProductsContainer>
          <ProductsContainer archived products={archiveList} />
        </div>
        {showDialogBox && (
          <DialogBox
            cancelCallback={this.hideDialogBox}
            cofirmCallback={this.deleteListHandler(
              listId,
              this.redirectHandler
            )}
            message="Do you really want to delete the list?"
          />
        )}
      </Fragment>
    );
  }
}

ShoppingList.propTypes = {
  history: PropTypes.objectOf(PropTypes.any),
  list: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,

  deleteList: PropTypes.func,
  fetchItemsFromGivenList: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  list: getShoppingList(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    { deleteList, fetchItemsFromGivenList }
  )(ShoppingList)
);
