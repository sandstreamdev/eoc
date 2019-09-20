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
  leaveList
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
import {
  getAnimationForDone,
  getAnimationForUnhandled
} from 'modules/list/components/Items/model/selectors';
import {
  disableAnimationForDoneItems,
  disableAnimationForUnhandledItems
} from 'modules/list/components/Items/model/actions';

class List extends Component {
  state = {
    breadcrumbs: [],
    dialogContext: null,
    isMembersBoxVisible: false,
    pendingForDetails: false,
    pendingForListArchivization: false
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
      }
    } = previousProps;
    const {
      currentUser: { id: userId },
      list,
      match: {
        params: { id: listId }
      }
    } = this.props;

    if (previousListId !== listId) {
      leaveRoom(Routes.LIST, listId, userId);
      this.fetchData();
    }

    if (previousList && list) {
      const {
        name: previousName,
        cohortName: previousCohortName
      } = previousList;
      const { name, cohortName } = list;
      const updateBreadcrumbs =
        previousName !== name || previousCohortName !== cohortName;

      if (updateBreadcrumbs) {
        this.handleBreadcrumbs();
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

    leaveRoom(Routes.LIST, listId, userId);
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

  render() {
    const {
      dialogContext,
      isMembersBoxVisible,
      pendingForDetails,
      pendingForListArchivization
    } = this.state;
    const {
      animateDoneItems,
      animateUnhandledItems,
      disableAnimationForDoneItems,
      disableAnimationForUnhandledItems,
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

    const { cohortId, isArchived, isMember, isOwner, name, type } = list;
    const isCohortList = cohortId !== null && cohortId !== undefined;

    return (
      <Fragment>
        {this.renderBreadcrumbs()}
        {isArchived ? (
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
                  <ItemsContainer
                    animate={animateUnhandledItems}
                    isMember={isMember}
                    items={undoneItems}
                    onDisableAnimations={disableAnimationForUnhandledItems}
                  >
                    {isMember && <InputBar />}
                  </ItemsContainer>
                  <ItemsContainer
                    animate={animateDoneItems}
                    done
                    isMember={isMember}
                    items={doneItems}
                    onDisableAnimations={disableAnimationForDoneItems}
                  />
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
      </Fragment>
    );
  }
}

List.propTypes = {
  animateDoneItems: PropTypes.bool,
  animateUnhandledItems: PropTypes.bool,
  currentUser: UserPropType.isRequired,
  doneItems: PropTypes.arrayOf(PropTypes.object),
  intl: IntlPropType.isRequired,
  list: PropTypes.objectOf(PropTypes.any),
  match: RouterMatchPropType.isRequired,
  members: PropTypes.objectOf(PropTypes.object),
  undoneItems: PropTypes.arrayOf(PropTypes.object),

  archiveList: PropTypes.func.isRequired,
  disableAnimationForDoneItems: PropTypes.func.isRequired,
  disableAnimationForUnhandledItems: PropTypes.func.isRequired,
  fetchListData: PropTypes.func.isRequired,
  leaveList: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { id }
    }
  } = ownProps;

  return {
    animateDoneItems: getAnimationForDone(state),
    animateUnhandledItems: getAnimationForUnhandled(state),
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
      disableAnimationForDoneItems,
      disableAnimationForUnhandledItems,
      fetchListData,
      leaveList
    }
  )
)(List);
