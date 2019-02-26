import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Toolbar, { ToolbarItem } from 'common/components/Toolbar';
import ProductsContainer from 'modules/shopping-list/components/ProductsContainer';
import { getShoppingList } from 'modules/shopping-list/model/selectors';
import InputBar from 'modules/shopping-list/components/InputBar';
import {
  archiveList,
  fetchListData,
  updateList
} from 'modules/shopping-list/model/actions';
import DialogBox from 'common/components/DialogBox';
import ModalBox from 'common/components/ModalBox';
import CreationForm from 'common/components/CreationForm';
import { EditIcon, ArchiveIcon } from 'assets/images/icons';
import { noOp } from 'common/utils/noOp';
import ArchivedList from 'modules/shopping-list/components/ArchivedList';
import { RouterMatchPropType } from 'common/constants/propTypes';

class ShoppingList extends Component {
  state = {
    showDialogBox: false,
    showUpdateForm: false
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const {
      fetchListData,
      match: {
        params: { id }
      }
    } = this.props;
    fetchListData(id);
  };

  showDialogBox = () => {
    this.setState({ showDialogBox: true });
  };

  hideDialogBox = () => {
    this.setState({ showDialogBox: false });
  };

  archiveListHandler = listId => () => {
    const { archiveList } = this.props;
    archiveList(listId)
      .then(this.hideDialogBox)
      .catch(noOp);
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

  render() {
    const { showDialogBox, showUpdateForm } = this.state;
    const {
      match: {
        params: { id: listId }
      },
      list
    } = this.props;

    if (!list) {
      return null;
    }
    const { description, isArchived, name, products } = list;
    const listItems = products || [];
    const archivedList = listItems.filter(item => item.isOrdered);
    const shoppingList = listItems.filter(item => !item.isOrdered);

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
                mainIcon={<ArchiveIcon />}
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
            <ProductsContainer archived products={archivedList} />
          </div>
        )}
        {isArchived && <ArchivedList listId={listId} />}
        {showDialogBox && (
          <DialogBox
            message="Do you really want to archive the list?"
            onCancel={this.hideDialogBox}
            onConfirm={this.archiveListHandler(listId)}
          />
        )}
        {showUpdateForm && (
          <ModalBox onCancel={this.hideUpdateForm}>
            <CreationForm
              defaultDescription={description}
              defaultName={name}
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
  list: PropTypes.objectOf(PropTypes.any),
  match: RouterMatchPropType.isRequired,

  archiveList: PropTypes.func.isRequired,
  fetchListData: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  list: getShoppingList(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    { archiveList, fetchListData, updateList }
  )(ShoppingList)
);
