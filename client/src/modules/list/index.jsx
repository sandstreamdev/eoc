import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Toolbar, { ToolbarLink } from 'common/components/Toolbar';
import ItemsContainer from 'modules/list/components/ItemsContainer';
import { getList, getItems, getMembers } from 'modules/list/model/selectors';
import InputBar from 'modules/list/components/InputBar';
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

export const ListType = Object.freeze({
  PRIVATE: 'private',
  PUBLIC: 'public'
});

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
    const { archiveList } = this.props;

    this.setState({ pendingForListArchivization: true });
    archiveList(listId).finally(() => {
      this.setState({ pendingForListArchivization: false });
      this.hideDialog();
    });
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
    const {
      dialogContext,
      isMembersBoxVisible,
      pendingForDetails,
      pendingForListArchivization
    } = this.state;

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

    const { cohortId, isArchived, isPrivate, name } = list;
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
        </Toolbar>
        {isArchived ? (
          <ArchivedList listId={listId} name={name} />
        ) : (
          <div className="wrapper">
            <div className="list">
              <ListHeader details={list} />
              {pendingForDetails ? (
                <Preloader />
              ) : (
                <Fragment>
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
                      isPrivate={isPrivate}
                      members={members}
                      route={Routes.LIST}
                    />
                  )}
                </Fragment>
              )}
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
                ? `"${name}" list archivization...`
                : `Do you really want to archive the "${name}" list?`
            }
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
  fetchListData: PropTypes.func.isRequired
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
    { archiveList, fetchListData }
  )(List)
);
