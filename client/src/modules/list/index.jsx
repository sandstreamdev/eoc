import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import ItemsContainer from 'modules/list/components/ItemsContainer';
import {
  getArchivedItems,
  getDoneItems,
  getList,
  getMembers,
  getUndoneItems
} from 'modules/list/model/selectors';
import InputBar from 'modules/list/components/Items/InputBar';
import { archiveList, fetchListData } from 'modules/list/model/actions';
import {
  fetchArchivedItems,
  removeArchivedItems
} from 'modules/list/components/Items/model/actions';
import Dialog, { DialogContext } from 'common/components/Dialog';
import ArchivedList from 'modules/list/components/ArchivedList';
import { RouterMatchPropType } from 'common/constants/propTypes';
import MembersBox from 'common/components/Members';
import { Routes } from 'common/constants/enums';
import ListHeader from './components/ListHeader';
import Preloader from 'common/components/Preloader';
import Breadcrumbs from 'common/components/Breadcrumbs';

class List extends Component {
  state = {
    areArchivedItemsVisible: false,
    breadcrumbs: [],
    dialogContext: null,
    isMembersBoxVisible: false,
    pendingForArchivedItems: false,
    pendingForDetails: false,
    pendingForListArchivization: false
  };

  componentDidMount() {
    this.setState({ pendingForDetails: true });

    this.fetchData().finally(() => {
      this.setState({ pendingForDetails: false });
      this.handleBreadcrumbs();
    });
  }

  handleBreadcrumbs = () => {
    const {
      list: { cohortId, cohortName, name, _id: listId }
    } = this.props;

    if (cohortId) {
      this.setState({
        breadcrumbs: [
          { name: Routes.COHORTS, path: `/${Routes.COHORTS}` },
          { name: cohortName, path: `/${Routes.COHORT}/${cohortId}` },
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
      list: { isOwner }
    } = this.props;

    if (isOwner) {
      this.setState({ pendingForListArchivization: true });

      archiveList(listId).finally(() => {
        this.setState({
          pendingForListArchivization: false,
          areArchivedItemsVisible: false
        });
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

  renderBreadcrumbs = () => {
    const { breadcrumbs } = this.state;
    const {
      list: { isGuest }
    } = this.props;

    return <Breadcrumbs breadcrumbs={breadcrumbs} isGuest={isGuest} />;
  };

  handleArchivedItemsVisibility = () =>
    this.setState(
      ({ areArchivedItemsVisible }) => ({
        areArchivedItemsVisible: !areArchivedItemsVisible
      }),
      () => this.handleArchivedItemsData()
    );

  handleArchivedItemsData = () => {
    const { areArchivedItemsVisible } = this.state;
    const {
      fetchArchivedItems,
      match: {
        params: { id }
      },
      removeArchivedItems
    } = this.props;

    if (areArchivedItemsVisible) {
      this.setState({ pendingForArchivedItems: true });

      fetchArchivedItems(id).finally(() =>
        this.setState({ pendingForArchivedItems: false })
      );
    } else {
      removeArchivedItems(id);
    }
  };

  render() {
    const {
      areArchivedItemsVisible,
      dialogContext,
      isMembersBoxVisible,
      pendingForArchivedItems,
      pendingForDetails,
      pendingForListArchivization
    } = this.state;
    const {
      archivedItems,
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

    const { cohortId, isArchived, isMember, isOwner, name, type } = list;
    const isCohortList = cohortId !== null;

    return (
      <Fragment>
        {this.renderBreadcrumbs()}
        {isArchived ? (
          <ArchivedList listId={listId} name={name} />
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
                  <ItemsContainer
                    isMember={isMember}
                    items={doneItems}
                    ordered
                  />
                </div>
                {isMember && (
                  <div className="list__archived-items">
                    <button
                      className="link-button"
                      onClick={this.handleArchivedItemsVisibility}
                      type="button"
                    >
                      {` ${
                        areArchivedItemsVisible ? 'hide' : 'show'
                      } archived items`}
                    </button>
                    {areArchivedItemsVisible && (
                      <div
                        className={classNames('list__items', {
                          'list__items--visible': areArchivedItemsVisible
                        })}
                      >
                        <ItemsContainer
                          archived
                          isMember={isMember}
                          items={archivedItems}
                        />
                        {pendingForArchivedItems && <Preloader />}
                      </div>
                    )}
                  </div>
                )}
                {!isArchived && isOwner && (
                  <button
                    className="link-button"
                    onClick={this.handleDialogContext(DialogContext.ARCHIVE)}
                    type="button"
                  >
                    {`Archive the "${name}" sack`}
                  </button>
                )}
                <div className="list__members">
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
  archivedItems: PropTypes.arrayOf(PropTypes.object),
  doneItems: PropTypes.arrayOf(PropTypes.object),
  list: PropTypes.objectOf(PropTypes.any),
  match: RouterMatchPropType.isRequired,
  members: PropTypes.objectOf(PropTypes.object),
  undoneItems: PropTypes.arrayOf(PropTypes.object),

  archiveList: PropTypes.func.isRequired,
  fetchArchivedItems: PropTypes.func.isRequired,
  fetchListData: PropTypes.func.isRequired,
  removeArchivedItems: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { id }
    }
  } = ownProps;

  return {
    archivedItems: getArchivedItems(state, id),
    doneItems: getDoneItems(state, id),
    list: getList(state, id),
    members: getMembers(state, id),
    undoneItems: getUndoneItems(state, id)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      archiveList,
      fetchArchivedItems,
      fetchListData,
      removeArchivedItems
    }
  )(List)
);
