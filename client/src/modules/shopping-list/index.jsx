import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Toolbar, { ToolbarItem } from 'common/components/Toolbar';
import ProductsContainer from 'modules/shopping-list/components/ProductsContainer';
import { getShoppingList } from 'modules/shopping-list/model/selectors';
import InputBar from 'modules/shopping-list/components/InputBar';
import {
  deleteList,
  deleteListSuccess as deleteListFromStore,
  fetchDataFromGivenList,
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
    showUpdateForm: false
  };

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    const {
      deleteListFromStore,
      list,
      match: {
        params: { id: listId }
      }
    } = this.props;
    if (list && list.isArchived) {
      deleteListFromStore(listId);
    }
  }

  fetchData = () => {
    const {
      fetchDataFromGivenList,
      match: {
        params: { id }
      }
    } = this.props;
    fetchDataFromGivenList(id);
  };

  showDialogBox = () => {
    this.setState({ showDialogBox: true });
  };

  hideDialogBox = () => {
    this.setState({ showDialogBox: false });
  };

  deleteListHandler = id => () => {
    const { deleteList } = this.props;
    deleteList(id)
      .then(this.redirectHandler)
      .catch(noOp);
  };

  archiveListHandler = listId => () => {
    this.hideDialogBox();
    const { updateList } = this.props;
    updateList(listId, { isArchived: true });
  };

  restoreListHandler = listId => () => {
    const { updateList } = this.props;
    updateList(listId, { isArchived: false });
  };

  redirectHandler = () => {
    const { history } = this.props;
    history.push('/dashboard');
  };

  hideUpdateForm = () => {
    this.setState({ showUpdateForm: false });
  };

  showUpdateForm = () => {
    this.setState({ showUpdateForm: true });
  };

  updateListHandler = listId => (name, description) => {
    const { updateList } = this.props;
    const dataToUpdate = {};

    name ? (dataToUpdate.name = name) : null;
    description ? (dataToUpdate.description = description) : null;

    updateList(listId, dataToUpdate);
    this.hideUpdateForm();
  };

  adjustDialogBox = (listId, isArchived) => {
    const dialogProps = {
      message: 'Do you really want to archive the list?',
      onConfirm: this.archiveListHandler(listId)
    };
    if (isArchived) {
      dialogProps.message =
        'Do you really want to permanently delete the list?';
      dialogProps.onConfirm = this.deleteListHandler(listId);
    }

    return (
      <DialogBox
        message={dialogProps.message}
        onCancel={this.hideDialogBox}
        onConfirm={dialogProps.onConfirm}
      />
    );
  };

  render() {
    const { showDialogBox, showUpdateForm } = this.state;
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
    const isArchived = list && list.isArchived ? list.isArchived : null;
    const name = list && list.name ? list.name : null;

    return (
      <Fragment>
        <Toolbar>
          {!isArchived && (
            <Fragment>
              <ToolbarItem
                mainIcon={<EditIcon />}
                onClick={this.showUpdateForm}
              />
              <ToolbarItem
                mainIcon={<RemoveIcon />}
                onClick={this.showDialogBox}
              />
            </Fragment>
          )}
        </Toolbar>
        {!isArchived && (
          <div className="app-wrapper">
            <InputBar />
            <ProductsContainer
              description={description}
              name={name}
              products={shoppingList}
            />
            <ProductsContainer archived products={archiveList} />
          </div>
        )}
        {isArchived && (
          <div className="archived-message">
            <h1 className="archived-message__header">
              This list was archived.
            </h1>
            <button
              className="archived-message__button"
              onClick={this.showDialogBox}
              type="button"
            >
              permanently delete
            </button>
            <button
              className="archived-message__button"
              type="button"
              onClick={this.restoreListHandler(listId)}
            >
              restore from archive
            </button>
          </div>
        )}
        {showDialogBox && this.adjustDialogBox(listId, isArchived)}
        {showUpdateForm && (
          <ModalBox onCancel={this.hideUpdateForm}>
            <CreationForm
              label="Edit list"
              onSubmit={this.updateListHandler(listId)}
              type="modal"
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
  deleteListFromStore: PropTypes.func.isRequired,
  fetchDataFromGivenList: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  list: getShoppingList(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    { deleteList, deleteListFromStore, fetchDataFromGivenList, updateList }
  )(ShoppingList)
);
