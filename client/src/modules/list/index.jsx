import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Toolbar, { ToolbarItem, ToolbarLink } from 'common/components/Toolbar';
import ItemsContainer from 'modules/list/components/ItemsContainer';
import { getList, getItems, getMembers } from 'modules/list/model/selectors';
import InputBar from 'modules/list/components/InputBar';
import {
  archiveList,
  fetchListData,
  updateList
} from 'modules/list/model/actions';
import Dialog, { DialogContext } from 'common/components/Dialog';
import FormDialog from 'common/components/FormDialog';
import { CohortIcon, EditIcon, ListIcon } from 'assets/images/icons';
import { noOp } from 'common/utils/noOp';
import ArchivedList from 'modules/list/components/ArchivedList';
import { RouterMatchPropType } from 'common/constants/propTypes';
import ArrowLeftIcon from 'assets/images/arrow-left-solid.svg';
import MembersBox from 'common/components/Members';
import { Routes } from 'common/constants/enums';

export const ListType = Object.freeze({
  PRIVATE: 'private',
  PUBLIC: 'public'
});

class List extends Component {
  state = {
    dialogContext: null,
    isMembersBoxVisible: false
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

  archiveListHandler = listId => () => {
    const { archiveList } = this.props;
    archiveList(listId)
      .then(this.hideDialog())
      .catch(noOp);
  };

  updateListHandler = listId => (name, description) => {
    const { updateList } = this.props;
    const dataToUpdate = {};

    name ? (dataToUpdate.name = name) : null;
    description ? (dataToUpdate.description = description) : null;

    updateList(listId, dataToUpdate);
    this.hideDialog();
  };

  checkIfArchived = () => {
    const { list } = this.props;
    return !list || (list && !list.isArchived);
  };

  checkIfOwner = () => {
    const { list } = this.props;
    return list && list.isOwner;
  };

  handleDialogContext = context => () =>
    this.setState({ dialogContext: context });

  hideDialog = () => this.handleDialogContext(null)();

  handleMembersBoxVisibility = () =>
    this.setState(({ isMembersBoxVisible }) => ({
      isMembersBoxVisible: !isMembersBoxVisible
    }));

  render() {
    const { dialogContext, isMembersBoxVisible } = this.state;
    const {
      items,
      match: {
        params: { id: listId }
      },
      list,
      members
    } = this.props;

    if (!list) {
      return null;
    }

    const { cohortId, description, isArchived, isPrivate, name } = list;
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
              title="Go back to cohort"
            />
          )}
          {!isArchived && this.checkIfOwner() && (
            <Fragment>
              <ToolbarItem
                mainIcon={<EditIcon />}
                onClick={this.handleDialogContext(DialogContext.UPDATE)}
                title="Edit list"
              />
            </Fragment>
          )}
        </Toolbar>
        {isArchived ? (
          <ArchivedList listId={listId} name={name} />
        ) : (
          <div className="wrapper">
            <div className="list">
              <h1 className="list__heading">
                <ListIcon />
                {name}
              </h1>
              <p className="list__description">{description}</p>
              <div className="list__items">
                <ItemsContainer items={listItems}>
                  <InputBar />
                </ItemsContainer>
                <ItemsContainer archived items={orderedItems} />
                <button
                  className="link-button"
                  onClick={this.handleDialogContext(DialogContext.ARCHIVE)}
                  type="button"
                >
                  {`Archive the "${name}" list`}
                </button>
              </div>
              <button
                className="link-button"
                onClick={this.handleMembersBoxVisibility}
                type="button"
              >
                {` ${isMembersBoxVisible ? 'hide' : 'show'} list's members`}
              </button>
              {isMembersBoxVisible && (
                <MembersBox
                  isCurrentUserAnOwner={this.checkIfOwner()}
                  route={Routes.LIST}
                  members={members}
                  isPrivate={isPrivate}
                />
              )}
            </div>
          </div>
        )}
        {dialogContext === DialogContext.ARCHIVE && (
          <Dialog
            onCancel={this.hideDialog}
            onConfirm={this.archiveListHandler(listId)}
            title={`Do you really want to archive the "${name}" list?`}
          />
        )}
        {dialogContext === DialogContext.UPDATE && (
          <FormDialog
            defaultDescription={description}
            defaultName={name}
            onCancel={this.hideDialog}
            onConfirm={this.updateListHandler(listId)}
            title="Edit list"
          />
        )}
      </Fragment>
    );
  }
}

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  list: PropTypes.objectOf(PropTypes.any),
  match: RouterMatchPropType.isRequired,
  members: PropTypes.objectOf(PropTypes.object),

  archiveList: PropTypes.func.isRequired,
  fetchListData: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { id }
    }
  } = ownProps;
  return {
    list: getList(state, id),
    items: getItems(state, id),
    members: getMembers(state, id)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { archiveList, fetchListData, updateList }
  )(List)
);
