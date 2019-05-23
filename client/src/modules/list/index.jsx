import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Toolbar, { ToolbarLink } from 'common/components/Toolbar';
import ItemsContainer from 'modules/list/components/ItemsContainer';
import {
  getDoneItems,
  getList,
  getMembers,
  getUndoneItems
} from 'modules/list/model/selectors';
import InputBar from 'modules/list/components/Items/InputBar';
import { archiveList, fetchListData } from 'modules/list/model/actions';
import Dialog, { DialogContext } from 'common/components/Dialog';
import { CohortIcon } from 'assets/images/icons';
import ArchivedList from 'modules/list/components/ArchivedList';
import { RouterMatchPropType } from 'common/constants/propTypes';
import ArrowLeftIcon from 'assets/images/arrow-left-solid.svg';
import MembersBox from 'common/components/Members';
import { Routes } from 'common/constants/enums';
import ListHeader from './components/ListHeader';
import Preloader from 'common/components/Preloader';

class List extends Component {
  state = {
    dialogContext: null,
    isMembersBoxVisible: false,
    pendingForDetails: false,
    pendingForListArchivization: false
  };

  componentDidMount() {
    if (this.checkIfArchived()) {
      this.setState({ pendingForDetails: true });

      this.fetchData().finally(() =>
        this.setState({ pendingForDetails: false })
      );
    }
  }

  fetchData = () => {
    const {
      fetchListData,
      match: {
        params: { id }
      }
    } = this.props;

    return fetchListData(id);
  };

  handleListArchivization = listId => () => {
    const {
      archiveList,
      list: { isOwner }
    } = this.props;

    if (isOwner) {
      this.setState({ pendingForListArchivization: true });

      archiveList(listId).finally(() => {
        this.setState({ pendingForListArchivization: false });
        this.hideDialog();
      });
    }
  };

  checkIfArchived = () => {
    const { list } = this.props;

    return !list || (list && !list.isArchived);
  };

  handleDialogContext = context => () =>
    this.setState({ dialogContext: context });

  hideDialog = () => this.handleDialogContext(null)();

  handleMembersBoxVisibility = () =>
    this.setState(({ isMembersBoxVisible }) => ({
      isMembersBoxVisible: !isMembersBoxVisible
    }));

  render() {
    const {
      dialogContext,
      isMembersBoxVisible,
      pendingForDetails,
      pendingForListArchivization
    } = this.state;
    const {
      doneItems,
      match: {
        params: { id: listId }
      },
      list,
      members,
      undoneItems
    } = this.props;

    if (!list) {
      return null;
    }

    const {
      cohortId,
      isArchived,
      isGuest,
      isMember,
      isOwner,
      name,
      type
    } = list;
    const isCohortList = cohortId !== null;

    return (
      <Fragment>
        <Toolbar>
          {cohortId && !isGuest && (
            <ToolbarLink
              additionalIconSrc={ArrowLeftIcon}
              mainIcon={<CohortIcon />}
              path={`/cohort/${cohortId}`}
              title="Go back to cohort"
            />
          )}
        </Toolbar>
        {isArchived ? (
          <ArchivedList listId={listId} name={name} />
        ) : (
          <div className="wrapper">
            <div className="list">
              <ListHeader details={list} isCohortList={isCohortList} />
              <div className="list__details">
                <div className="list__items">
                  <ItemsContainer isMember={isMember} items={undoneItems}>
                    {isMember && <InputBar />}
                  </ItemsContainer>
                  <ItemsContainer
                    archived
                    isMember={isMember}
                    items={doneItems}
                  />
                  {!isArchived && isOwner && (
                    <button
                      className="link-button"
                      onClick={this.handleDialogContext(DialogContext.ARCHIVE)}
                      type="button"
                    >
                      {`Archive the "${name}" sack`}
                    </button>
                  )}
                </div>
                <button
                  className="link-button"
                  onClick={this.handleMembersBoxVisibility}
                  type="button"
                >
                  {` ${isMembersBoxVisible ? 'hide' : 'show'} sack's members`}
                </button>
                {isMembersBoxVisible && (
                  <MembersBox
                    isCohortList={isCohortList}
                    isCurrentUserAnOwner={isOwner}
                    type={type}
                    isMember={isMember}
                    members={members}
                    route={Routes.LIST}
                  />
                )}
                {pendingForDetails && <Preloader />}
              </div>
            </div>
          </div>
        )}
        {dialogContext === DialogContext.ARCHIVE && (
          <Dialog
            onCancel={this.hideDialog}
            onConfirm={this.handleListArchivization(listId)}
            pending={pendingForListArchivization}
            title={
              pendingForListArchivization
                ? `"${name}" sack archivization...`
                : `Do you really want to archive the "${name}" sack?`
            }
          />
        )}
      </Fragment>
    );
  }
}

List.propTypes = {
  doneItems: PropTypes.arrayOf(PropTypes.object),
  list: PropTypes.objectOf(PropTypes.any),
  match: RouterMatchPropType.isRequired,
  members: PropTypes.objectOf(PropTypes.object),
  undoneItems: PropTypes.arrayOf(PropTypes.object),

  archiveList: PropTypes.func.isRequired,
  fetchListData: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { id }
    }
  } = ownProps;

  return {
    doneItems: getDoneItems(state, id),
    list: getList(state, id),
    members: getMembers(state, id),
    undoneItems: getUndoneItems(state, id)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { archiveList, fetchListData }
  )(List)
);
