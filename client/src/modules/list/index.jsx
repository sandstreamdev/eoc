import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import ItemsContainer from 'modules/list/components/ItemsContainer';
import {
  getDoneItems,
  getList,
  getMembers,
  getUndoneItems
} from 'modules/list/model/selectors';
import InputBar from 'modules/list/components/Items/InputBar';
import {
  archiveList,
  fetchListData,
  leaveList,
  restoreList
} from 'modules/list/model/actions';
import Dialog, { DialogContext } from 'common/components/Dialog';
import ArchivedList from 'modules/list/components/ArchivedList';
import {
  IntlPropType,
  RouterMatchPropType,
  UserPropType
} from 'common/constants/propTypes';
import MembersBox from 'common/components/Members';
import { Routes } from 'common/constants/enums';
import ListHeader from './components/ListHeader';
import Preloader from 'common/components/Preloader';
import Breadcrumbs from 'common/components/Breadcrumbs';
import ArchivedItemsContainer from 'modules/list/components/ArchivedItemsContainer';
import { getCurrentUser } from 'modules/user/model/selectors';
import { ListType } from './consts';
import { ResourceNotFoundException } from 'common/exceptions';
import { joinRoom, leaveRoom } from 'sockets';
import history from 'common/utils/history';
import { dashboardRoute, listRoute } from 'common/utils/helpers';
import './List.scss';

class List extends Component {
  state = {
    breadcrumbs: [],
    dialogContext: null,
    isUnavailable: false,
    isMembersBoxVisible: false,
    pendingForDetails: false,
    pendingForLeaving: false,
    pendingForListArchivization: false,
    pendingForListRestoration: false
  };

  componentDidMount() {
    const {
      match: {
        params: { id: listId }
      }
    } = this.props;
    const { isUnavailable } = this.state;
    const roomConfig = {
      subscribeMetaData: !isUnavailable,
      resourceId: listId,
      roomPrefix: Routes.LIST
    };

    joinRoom(roomConfig);
    this.fetchData();
  }

  componentDidUpdate(previousProps) {
    const {
      list: previousList,
      match: {
        params: { id: previousListId }
      },
      members: previousMembers
    } = previousProps;
    const {
      currentUser: { id: userId },
      list,
      match: {
        params: { id: listId }
      },
      members
    } = this.props;
    const { isUnavailable } = this.state;
    const hasListChanged = listId !== previousListId;
    const roomConfig = {
      subscribeMetaData: !isUnavailable,
      resourceId: previousListId,
      roomPrefix: Routes.LIST
    };

    if (hasListChanged) {
      leaveRoom(roomConfig);
      joinRoom({ ...roomConfig, resourceId: listId });
      this.fetchData();
    }

    if (previousList && list) {
      const {
        cohortName: previousCohortName,
        name: previousName
      } = previousList;
      const { name, cohortName } = list;
      const hasNamesBeenChanged =
        previousName !== name || previousCohortName !== cohortName;
      const hasListBeenArchived = !previousList.isArchived && list.isArchived;
      const hasListBeenRestored = previousList.isArchived && !list.isArchived;
      const hasUserBeenRemoved = previousMembers[userId] && !members[userId];
      const hasListBeenDeleted = !previousList.isDeleted && list.isDeleted;

      if (hasNamesBeenChanged) {
        this.handleBreadcrumbs();
      }

      if (hasListBeenArchived || hasUserBeenRemoved || hasListBeenDeleted) {
        this.handleMakeListUnavailable();
      } else if (hasListBeenRestored) {
        this.handleMakeListAvailable();
      }
    }
  }

  componentWillUnmount() {
    const {
      match: {
        params: { id: listId }
      }
    } = this.props;
    const { isUnavailable } = this.state;
    const roomConfig = {
      subscribeMetaData: !isUnavailable,
      resourceId: listId,
      roomPrefix: Routes.LIST
    };

    leaveRoom(roomConfig);
  }

  handleBreadcrumbs = () => {
    const {
      list: { cohortId, cohortName, isGuest, name, _id: listId }
    } = this.props;

    if (cohortId) {
      this.setState({
        breadcrumbs: [
          { name: Routes.COHORTS, path: `/${Routes.COHORTS}` },
          {
            name: cohortName,
            path: isGuest ? null : `/${Routes.COHORT}/${cohortId}`
          },
          { name, path: `/${Routes.LIST}/${listId}` }
        ]
      });

      return;
    }

    this.setState({
      breadcrumbs: [
        { name: Routes.DASHBOARD, path: `/${Routes.DASHBOARD}` },
        { name, path: `/${Routes.LIST}/${listId}` }
      ]
    });
  };

  fetchData = async () => {
    const {
      fetchListData,
      match: {
        params: { id }
      }
    } = this.props;
    this.setState({ pendingForDetails: true });

    try {
      const result = await fetchListData(id);

      if (result) {
        this.setState({ pendingForDetails: false });
        this.handleBreadcrumbs();
      }
    } catch (error) {
      if (!(error instanceof ResourceNotFoundException)) {
        this.setState({ pendingForDetails: false });
      }
    }
  };

  handleListArchivization = listId => () => {
    const {
      archiveList,
      list: { cohortId, isOwner, name, isGuest }
    } = this.props;

    if (isOwner) {
      this.setState({ pendingForListArchivization: true });

      archiveList(listId, name, cohortId, isGuest).catch(() => {
        this.setState({ pendingForListArchivization: false });
        this.hideDialog();
      });
    }
  };

  handleDialogContext = context => () =>
    this.setState({ dialogContext: context });

  hideDialog = () => this.handleDialogContext(null)();

  handleMembersBoxVisibility = () =>
    this.setState(({ isMembersBoxVisible }) => ({
      isMembersBoxVisible: !isMembersBoxVisible
    }));

  handleLeave = () => {
    const {
      currentUser: { id: currentUserId, name },
      leaveList,
      list: { cohortId, type },
      match: {
        params: { id }
      }
    } = this.props;

    this.setState({ pendingForLeaving: true });

    return leaveList(id, currentUserId, cohortId, name, type).catch(() =>
      this.setState({ pendingForLeaving: false })
    );
  };

  renderBreadcrumbs = () => {
    const { breadcrumbs } = this.state;
    const {
      list: { isGuest }
    } = this.props;

    return <Breadcrumbs breadcrumbs={breadcrumbs} isGuest={isGuest} />;
  };

  handleRedirect = () => history.replace(dashboardRoute());

  handleMakeListUnavailable = () => this.setState({ isUnavailable: true });

  handleMakeListAvailable = () => this.setState({ isUnavailable: false });

  handleRestoreList = () => {
    const {
      list: { name, isOwner },
      match: {
        params: { id: listId }
      },
      restoreList
    } = this.props;

    if (isOwner) {
      this.setState({ pendingForListRestoration: true });

      restoreList(listId, name)
        .then(this.handleMakeListAvailable)
        .finally(() => this.setState({ pendingForListRestoration: false }));
    }
  };

  render() {
    const {
      dialogContext,
      isUnavailable,
      isMembersBoxVisible,
      pendingForDetails,
      pendingForLeaving,
      pendingForListArchivization,
      pendingForListRestoration
    } = this.state;
    const {
      doneItems,
      intl: { formatMessage },
      match: {
        params: { id: listId }
      },
      list,
      members,
      undoneItems
    } = this.props;

    if (!list) {
      return <Preloader />;
    }

    const {
      cohortId,
      cohortName,
      isArchived,
      isDeleted,
      isMember,
      isOwner,
      name,
      externalAction,
      type
    } = list;
    const isCohortList = cohortId !== null && cohortId !== undefined;
    const isDialogForRemovedListVisible =
      isUnavailable &&
      externalAction &&
      !pendingForListArchivization &&
      !pendingForLeaving;
    const archivedListView = (isArchived && !isUnavailable) || isDeleted;
    const isArchiveDialogVisible = dialogContext === DialogContext.ARCHIVE;
    const dialogContextMessage = formatMessage({
      id: 'list.label'
    });
    const dialogTitle = formatMessage(
      {
        id: 'common.actions.not-available'
      },
      { context: dialogContextMessage, name }
    );

    return (
      <>
        {this.renderBreadcrumbs()}
        {archivedListView ? (
          <ArchivedList
            cohortId={cohortId}
            isOwner={isOwner}
            listId={listId}
            name={name}
          />
        ) : (
          <div className="wrapper">
            <div className="list">
              <ListHeader
                details={list}
                isCohortList={isCohortList}
                updateBreadcrumbs={this.handleBreadcrumbs}
              />
              <div className="list__details">
                <div className="list__items">
                  <ItemsContainer isMember={isMember} items={undoneItems}>
                    {isMember && <InputBar />}
                  </ItemsContainer>
                  <ItemsContainer done isMember={isMember} items={doneItems} />
                </div>
                {isMember && (
                  <ArchivedItemsContainer isMember={isMember} name={name} />
                )}
                {!isArchived && isOwner && (
                  <button
                    className="link-button"
                    onClick={this.handleDialogContext(DialogContext.ARCHIVE)}
                    type="button"
                  >
                    <FormattedMessage
                      id="list.index.arch-sack"
                      values={{ name }}
                    />
                  </button>
                )}
                <div className="list__members">
                  <button
                    className="link-button"
                    onClick={this.handleMembersBoxVisibility}
                    type="button"
                  >
                    <FormattedMessage
                      id={
                        isMembersBoxVisible
                          ? 'list.index.hide-members'
                          : 'list.index.show-members'
                      }
                    />
                  </button>
                  {isMembersBoxVisible && (
                    <MembersBox
                      inviteData={{
                        name,
                        url: listRoute(listId)
                      }}
                      isCohortList={isCohortList}
                      isCurrentUserAnOwner={isOwner}
                      isMember={isMember}
                      isPrivateList={type === ListType.LIMITED}
                      members={members}
                      onListLeave={this.handleLeave}
                      route={Routes.LIST}
                      type={type}
                    />
                  )}
                </div>
                {pendingForDetails && <Preloader />}
              </div>
            </div>
          </div>
        )}
        <Dialog
          cancelLabel={formatMessage({ id: 'common.button.cancel' })}
          confirmLabel={formatMessage({ id: 'common.button.confirm' })}
          isVisible={isArchiveDialogVisible}
          onCancel={this.hideDialog}
          onConfirm={this.handleListArchivization(listId)}
          pending={pendingForListArchivization}
          title={formatMessage(
            {
              id: pendingForListArchivization
                ? 'list.index.archivization'
                : 'list.index.question'
            },
            { name }
          )}
        />
        {externalAction && (
          <Dialog
            cancelLabel={formatMessage({ id: 'common.button.dashboard' })}
            confirmLabel={formatMessage({ id: 'common.button.restore' })}
            hasPermissions={isOwner}
            isVisible={isDialogForRemovedListVisible}
            onCancel={this.handleRedirect}
            onConfirm={
              isArchived && !isDeleted ? this.handleRestoreList : undefined
            }
            pending={pendingForListRestoration}
            title={dialogTitle}
          >
            <p>
              <FormattedMessage
                id={externalAction.messageId}
                values={{
                  name,
                  cohortName,
                  context: dialogContextMessage,
                  performer: externalAction.performer
                }}
              />
              {!isOwner && (
                <>
                  {' '}
                  <FormattedMessage
                    id="common.actions.not-available-contact-owner"
                    values={{ context: dialogContextMessage, name }}
                  />
                </>
              )}
            </p>
          </Dialog>
        )}
      </>
    );
  }
}

List.propTypes = {
  currentUser: UserPropType.isRequired,
  doneItems: PropTypes.arrayOf(PropTypes.object),
  intl: IntlPropType.isRequired,
  list: PropTypes.objectOf(PropTypes.any),
  match: RouterMatchPropType.isRequired,
  members: PropTypes.objectOf(PropTypes.object),
  undoneItems: PropTypes.arrayOf(PropTypes.object),

  archiveList: PropTypes.func.isRequired,
  fetchListData: PropTypes.func.isRequired,
  leaveList: PropTypes.func.isRequired,
  restoreList: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { id }
    }
  } = ownProps;

  return {
    currentUser: getCurrentUser(state),
    doneItems: getDoneItems(state, id),
    list: getList(state, id),
    members: getMembers(state, id),
    undoneItems: getUndoneItems(state, id)
  };
};

export default _flowRight(
  injectIntl,
  withRouter,
  connect(mapStateToProps, {
    archiveList,
    fetchListData,
    leaveList,
    restoreList
  })
)(List);
