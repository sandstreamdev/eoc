import React, { Component, Fragment } from 'react';
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
import { joinRoom, leaveRoom } from 'common/model/actions';
import history from 'common/utils/history';
import { dashboardRoute } from 'common/utils/helpers';
import './List.scss';

class List extends Component {
  state = {
    breadcrumbs: [],
    dialogContext: null,
    isDisabled: false,
    isMembersBoxVisible: false,
    pendingForDetails: false,
    pendingForListArchivization: false,
    pendingForListRestoring: false
  };

  componentDidMount() {
    const {
      currentUser: { id: userId },
      match: {
        params: { id: cohortId }
      }
    } = this.props;

    this.setState({ pendingForDetails: true });

    this.fetchData()
      .then(() => {
        this.setState({ pendingForDetails: false });
        this.handleBreadcrumbs();
      })
      .catch(err => {
        if (!(err instanceof ResourceNotFoundException)) {
          this.setState({ pendingForDetails: false });
        }
      });

    joinRoom(Routes.LIST, cohortId, userId);
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
    const { isDisabled } = this.state;

    if (previousListId !== listId) {
      leaveRoom(Routes.LIST, listId, userId)(isDisabled);
      this.fetchData();
    }

    if (previousList && list) {
      const {
        cohortName: previousCohortName,
        name: previousName
      } = previousList;
      const { name, cohortName } = list;
      const updateBreadcrumbs =
        previousName !== name || previousCohortName !== cohortName;

      if (updateBreadcrumbs) {
        this.handleBreadcrumbs();
      }

      if (
        (!previousList.isArchived && list.isArchived) ||
        (previousMembers[userId] && !members[userId]) ||
        (!previousList.isDeleted && list.isDeleted)
      ) {
        this.handleDisableList();
      }

      if (
        (previousList.isArchived && !list.isArchived) ||
        (!previousMembers[userId] && members[userId]) ||
        (previousList.isDeleted && !list.isDeleted)
      ) {
        this.handleEnableList();
      }
    }
  }

  componentWillUnmount() {
    const {
      currentUser: { id: userId },
      match: {
        params: { id: listId }
      }
    } = this.props;
    const { isDisabled } = this.state;

    leaveRoom(Routes.LIST, listId, userId)(isDisabled);
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

    return leaveList(id, currentUserId, cohortId, name, type);
  };

  renderBreadcrumbs = () => {
    const { breadcrumbs } = this.state;
    const {
      list: { isGuest }
    } = this.props;

    return <Breadcrumbs breadcrumbs={breadcrumbs} isGuest={isGuest} />;
  };

  handleRedirect = () => history.replace(dashboardRoute());

  handleDisableList = () => this.setState({ isDisabled: true });

  handleEnableList = () => this.setState({ isDisabled: false });

  handleRestoreList = () => {
    const {
      list: { name, isOwner },
      match: {
        params: { id: listId }
      },
      restoreList
    } = this.props;

    if (isOwner) {
      this.setState({ pendingForListRestoring: true });

      restoreList(listId, name)
        .then(this.handleEnableList)
        .finally(() => this.setState({ pendingForListRestoring: false }));
    }
  };

  render() {
    const {
      dialogContext,
      isDisabled,
      isMembersBoxVisible,
      pendingForDetails,
      pendingForListArchivization,
      pendingForListRestoring
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
      return null;
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
    const idDialogForRemovedListVisible =
      isDisabled && externalAction && !pendingForListArchivization;
    const archivedListView = (isArchived && !isDisabled) || isDeleted;

    return (
      <Fragment>
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
        {dialogContext === DialogContext.ARCHIVE && (
          <Dialog
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
        )}
        {idDialogForRemovedListVisible && (
          <Dialog
            cancelLabel="common.button.dashboard"
            confirmLabel="common.button.restore"
            hasPermissions={isOwner}
            onCancel={this.handleRedirect}
            onConfirm={isArchived && !isDeleted ? this.handleRestoreList : null}
            pending={pendingForListRestoring}
            title={formatMessage(
              {
                id: 'list.actions.not-available'
              },
              { name }
            )}
          >
            <p>
              <FormattedMessage
                id={externalAction.messageId}
                values={{
                  name,
                  cohortName,
                  performer: externalAction.performer
                }}
              />
              {!isOwner && (
                <FormattedMessage
                  id="list.actions.not-available-contact-owner"
                  values={{ name }}
                />
              )}
            </p>
          </Dialog>
        )}
      </Fragment>
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
  connect(
    mapStateToProps,
    {
      archiveList,
      fetchListData,
      leaveList,
      restoreList
    }
  )
)(List);
