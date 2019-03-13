import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Toolbar, { ToolbarItem, ToolbarLink } from 'common/components/Toolbar';
import ProductsContainer from 'modules/shopping-list/components/ProductsContainer';
import { getList, getItems } from 'modules/shopping-list/model/selectors';
import InputBar from 'modules/shopping-list/components/InputBar';
import {
  archiveList,
  fetchListData,
  updateList
} from 'modules/shopping-list/model/actions';
import DialogBox from 'common/components/DialogBox';
import ModalForm from 'common/components/ModalForm';
import { CohortIcon, EditIcon, ArchiveIcon } from 'assets/images/icons';
import { noOp } from 'common/utils/noOp';
import ArchivedList from 'modules/shopping-list/components/ArchivedList';
import { RouterMatchPropType } from 'common/constants/propTypes';
import ArrowLeftIcon from 'assets/images/arrow-left-solid.svg';

class ShoppingList extends Component {
  state = {
    showDialogBox: false,
    showUpdateForm: false
  };

  componentDidMount() {
    if (this.checkIfArchived()) {
      this.fetchData();
    }
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

  checkIfArchived = () => {
    const { list } = this.props;
    return !list || (list && !list.isArchived);
  };

  checkIfAdmin = () => {
    const { list } = this.props;
    return list && list.isAdmin;
  };

  render() {
    const { showDialogBox, showUpdateForm } = this.state;
    const {
      items,
      match: {
        params: { id: listId }
      },
      list
    } = this.props;

    if (!list) {
      return null;
    }
    const { cohortId, description, isArchived, name } = list;
    const orderedItems = items ? items.filter(item => item.isOrdered) : [];
    const listItems = items ? items.filter(item => !item.isOrdered) : [];

    return (
      <Fragment>
        <Toolbar>
          {cohortId && (
            <ToolbarLink
              additionalIconSrc={ArrowLeftIcon}
              mainIcon={<CohortIcon />}
              path={`/cohort/${cohortId}`}
              title="Go back to cohort."
            />
          )}
          {!isArchived && this.checkIfAdmin() && (
            <Fragment>
              <ToolbarItem
                mainIcon={<EditIcon />}
                onClick={this.showUpdateForm}
                title="Edit list."
              />
              <ToolbarItem
                mainIcon={<ArchiveIcon />}
                onClick={this.showDialogBox}
                title="Archive list."
              />
            </Fragment>
          )}
        </Toolbar>
        {!isArchived && (
          <div className="wrapper list-wrapper">
            <InputBar />
            <ProductsContainer
              description={description}
              name={name}
              products={listItems}
            />
            <ProductsContainer archived products={orderedItems} />
          </div>
        )}
        {isArchived && <ArchivedList listId={listId} name={name} />}
        {showDialogBox && (
          <DialogBox
            message={`Do you really want to archive the ${name} list?`}
            onCancel={this.hideDialogBox}
            onConfirm={this.archiveListHandler(listId)}
          />
        )}
        {showUpdateForm && (
          <ModalForm
            defaultDescription={description}
            defaultName={name}
            label="Edit list"
            onCancel={this.hideUpdateForm}
            onSubmit={this.updateListHandler(listId)}
          />
        )}
      </Fragment>
    );
  }
}

ShoppingList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  list: PropTypes.objectOf(PropTypes.any),
  match: RouterMatchPropType.isRequired,

  archiveList: PropTypes.func.isRequired,
  fetchListData: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  list: getList(state, ownProps.match.params.id),
  items: getItems(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    { archiveList, fetchListData, updateList }
  )(ShoppingList)
);
