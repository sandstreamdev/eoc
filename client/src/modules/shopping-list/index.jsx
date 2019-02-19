import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Toolbar from 'common/components/Toolbar/Toolbar';
import ToolbarItem from 'common/components/Toolbar/components/ToolbarItem/ToolbarItem';
import ProductsContainer from 'modules/shopping-list/components/ProductsContainer';
import { getShoppingList } from 'modules/shopping-list/model/selectors';
import InputBar from 'modules/shopping-list/components/InputBar';
import {
  fetchItemsFromGivenList,
  deleteList,
  updateList
} from 'modules/shopping-list/model/actions';
import DialogBox from 'common/components/DialogBox';
import ModalBox from 'common/components/ModalBox';
import { noOp } from 'common/utils/noOp';
import CreationForm from 'common/components/CreationForm';
import { EditIcon, RemoveIcon } from 'assets/images/icons';

class ShoppingList extends Component {
  state = {
    showDialogBox: false,
    showUpdateFrom: false
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

  deleteListHandler = id => () => {
    this.hideDialogBox();
    const { deleteList } = this.props;
    deleteList(id)
      .then(this.redirectHandler)
      .catch(noOp);
  };

  redirectHandler = () => {
    const { history } = this.props;
    history.push('/dashboard');
  };

  hideUpdateForm = () => {
    this.setState({ showUpdateFrom: false });
  };

  showUpdateForm = () => {
    this.setState({ showUpdateFrom: true });
  };

  updateListHandler = listId => (name, description) => {
    const { updateList } = this.props;
    const dataToUpdate = {};

    name ? (dataToUpdate.name = name) : null;
    description ? (dataToUpdate.description = description) : null;

    updateList(listId, dataToUpdate);
    this.hideUpdateForm();
  };

  render() {
    const { showDialogBox, showUpdateFrom } = this.state;
    const {
      match: {
        params: { id: listId }
      },
      list
    } = this.props;
    const listItems = list && list.products ? list.products : [];
    const archiveList = listItems.filter(item => item.isOrdered);
    const shoppingList = listItems.filter(item => !item.isOrdered);
    const description = list && list.description ? list.description : null;
    const name = list && list.name ? list.name : null;

    return (
      <Fragment>
        <Toolbar>
          <ToolbarItem mainIcon={<EditIcon />} onClick={this.showUpdateForm} />
          <ToolbarItem mainIcon={<RemoveIcon />} onClick={this.showDialogBox} />
        </Toolbar>
        <div className="app-wrapper">
          <InputBar />
          <ProductsContainer
            description={description}
            name={name}
            products={shoppingList}
          />
          <ProductsContainer archived products={archiveList} />
        </div>
        {showDialogBox && (
          <ModalBox>
            <DialogBox
              onCancel={this.hideDialogBox}
              onConfirm={this.deleteListHandler(listId)}
              message="Do you really want to delete the list?"
            />
          </ModalBox>
        )}
        {showUpdateFrom && (
          <ModalBox onClose={this.hideUpdateForm}>
            <CreationForm
              type="modal"
              label="Edit list"
              onSubmit={this.updateListHandler(listId)}
            />
          </ModalBox>
        )}
      </Fragment>
    );
  }
}

ShoppingList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  list: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,

  deleteList: PropTypes.func.isRequired,
  fetchItemsFromGivenList: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  list: getShoppingList(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    { deleteList, fetchItemsFromGivenList, updateList }
  )(ShoppingList)
);
