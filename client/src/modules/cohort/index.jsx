import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import {
  getCohortActiveLists,
  getCohortArchivedLists
} from 'modules/list/model/selectors';
import {
  createList,
  fetchArchivedListsMetaData,
  fetchListsMetaData,
  removeArchivedListsMetaData
} from 'modules/list/model/actions';
import { ListIcon } from 'assets/images/icons';
import { getCohortDetails, getMembers } from './model/selectors';
import {
  IntlPropType,
  RouterMatchPropType,
  UserPropType
} from 'common/constants/propTypes';
import FormDialog from 'common/components/FormDialog';
import {
  archiveCohort,
  fetchCohortDetails,
  leaveCohort,
  restoreCohort
} from './model/actions';
import Dialog, { DialogContext } from 'common/components/Dialog';
import ArchivedCohort from 'modules/cohort/components/ArchivedCohort';
import CollectionView from 'common/components/CollectionView';
import { ListType } from 'modules/list/consts';
import MembersBox from 'common/components/Members';
import { ColorType, Routes } from 'common/constants/enums';
import CohortHeader from './components/CohortHeader';
import Preloader from 'common/components/Preloader';
import Breadcrumbs from 'common/components/Breadcrumbs';
import { getCurrentUser } from 'modules/user/model/selectors';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import {
  cohortsRoute,
  formatName,
  makeAbortablePromise
} from 'common/utils/helpers';
import { joinRoom, leaveRoom } from 'common/model/actions';
import history from 'common/utils/history';

import './Cohort.scss';

const initialState = {
  areArchivedListsVisible: false,
  breadcrumbs: [],
  dialogContext: null,
  isUnavailable: false,
  pendingForArchivedLists: false,
  pendingForCohortArchivization: false,
  pendingForCohortRestoration: false,
  pendingForDetails: false,
  pendingForListCreation: false,
  type: ListType.LIMITED
};

class Cohort extends PureComponent {
  pendingPromises = [];

  state = initialState;

  componentDidMount() {
    const {
      currentUser: { id: userId },
      match: {
        params: { id: cohortId }
      }
    } = this.props;
    const { isUnavailable } = this.state;

    this.fetchData();

    const roomConfig = {
      subscribeMetaData: !isUnavailable,
      resourceId: cohortId,
      roomPrefix: Routes.COHORT,
      userId
    };

    joinRoom(roomConfig);
  }

  componentDidUpdate(previousProps) {
    const {
      cohortDetails: cohort,
      match: {
        params: { id: cohortId }
      },
      members
    } = this.props;
    const {
      cohortDetails: previousCohort,
      currentUser: { id: userId },
      match: {
        params: { id: previousCohortId }
      },
      members: previousMembers
    } = previousProps;
    const { isUnavailable } = this.state;
    const hasCohortChanged = cohortId !== previousCohortId;
    const cohortUpdated = previousCohort && cohort;
    const roomConfig = {
      subscribeMetaData: !isUnavailable,
      resourceId: previousCohortId,
      roomPrefix: Routes.COHORT,
      userId
    };

    if (hasCohortChanged) {
      leaveRoom(roomConfig);
      joinRoom({ ...roomConfig, resourceId: cohortId });
      this.fetchData();
    }

    if (cohortUpdated) {
      const hasNameBeenChanged = previousCohort.name !== cohort.name;
      const hasCohortBeenArchived =
        !previousCohort.isArchived && cohort.isArchived;
      const hasCohortBeenRestored =
        previousCohort.isArchived && !cohort.isArchived;
      const hasUserBeenRemoved = previousMembers[userId] && !members[userId];
      const hasCohortBeenDeleted =
        !previousCohort.isDeleted && cohort.isDeleted;

      if (hasNameBeenChanged) {
        this.handleBreadcrumbs();
      }

      if (hasCohortBeenArchived || hasUserBeenRemoved || hasCohortBeenDeleted) {
        this.handleMakeCohortUnavailable();
      } else if (hasCohortBeenRestored) {
        this.handleMakeCohortAvailable();
      }
    }
  }

  componentWillUnmount() {
    const {
      currentUser: { id: userId },
      match: {
        params: { id: cohortId }
      }
    } = this.props;
    const { isUnavailable } = this.state;
    const roomConfig = {
      subscribeMetaData: !isUnavailable,
      resourceId: cohortId,
      roomPrefix: Routes.COHORT,
      userId
    };

    leaveRoom(roomConfig);
    this.pendingPromises.forEach(promise => promise.abort());
  }

  fetchData = () => {
    const {
      fetchCohortDetails,
      fetchListsMetaData,
      match: {
        params: { id }
      }
    } = this.props;

    const fetchPromises = [];

    this.setState({ pendingForDetails: true });

    const abortableFetchDetails = makeAbortablePromise(fetchCohortDetails(id));

    this.pendingPromises.push(abortableFetchDetails);
    fetchPromises.push(abortableFetchDetails.promise);

    if (!this.checkIfArchived()) {
      const abortableFetchLists = makeAbortablePromise(fetchListsMetaData(id));

      this.pendingPromises.push(abortableFetchLists);
      fetchPromises.push(abortableFetchLists.promise);
    }

    Promise.all(fetchPromises)
      .then(() => {
        this.handleBreadcrumbs();
        this.setState({ pendingForDetails: false });
      })
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pendingForDetails: false });
        }
      });
  };

  handleBreadcrumbs = () => {
    const {
      cohortDetails: { name },
      match: {
        params: { id: cohortId }
      }
    } = this.props;

    this.setState({
      breadcrumbs: [
        { name: Routes.COHORTS, path: `/${Routes.COHORTS}` },
        {
          name,
          path: `/${Routes.COHORT}/${cohortId}`
        }
      ]
    });
  };

  handleListCreation = (name, description) => {
    const {
      createList,
      match: {
        params: { id: cohortId }
      }
    } = this.props;

    const { type } = this.state;
    const data = { name, description, cohortId, type };

    this.setState({ pendingForListCreation: true });

    createList(data).finally(() => {
      this.setState(initialState);
      this.hideDialog();
    });
  };

  handleCohortArchivization = () => () => {
    const { archiveCohort } = this.props;
    const {
      cohortDetails: { name },
      match: {
        params: { id }
      }
    } = this.props;

    this.setState({ pendingForCohortArchivization: true });

    archiveCohort(id, name).catch(() => {
      this.setState({ pendingForCohortArchivization: false });
      this.hideDialog();
    });
  };

  checkIfArchived = () => {
    const { cohortDetails } = this.props;

    return cohortDetails && cohortDetails.isArchived;
  };

  handleDialogContext = context => () =>
    this.setState({ dialogContext: context });

  hideDialog = () => this.handleDialogContext(null)();

  handleArchivedListsVisibility = () => () =>
    this.setState(
      ({ areArchivedListsVisible }) => ({
        areArchivedListsVisible: !areArchivedListsVisible
      }),
      () => this.handleArchivedListsData()
    );

  handleArchivedListsData = () => {
    const { areArchivedListsVisible } = this.state;
    const {
      fetchArchivedListsMetaData,
      match: {
        params: { id: cohortId }
      },
      removeArchivedListsMetaData
    } = this.props;

    if (areArchivedListsVisible) {
      this.setState({ pendingForArchivedLists: true });

      fetchArchivedListsMetaData(cohortId).finally(() =>
        this.setState({ pendingForArchivedLists: false })
      );
    } else {
      removeArchivedListsMetaData();
    }
  };

  handleListType = type => this.setState({ type });

  handleLeave = () => {
    const {
      currentUser: { id: currentUserId, name },
      intl: { formatMessage },
      leaveCohort,
      match: {
        params: { id }
      }
    } = this.props;
    const formattedName = formatName(name, formatMessage);

    return leaveCohort(id, currentUserId, formattedName);
  };

  renderBreadcrumbs = () => {
    const { breadcrumbs } = this.state;

    return <Breadcrumbs breadcrumbs={breadcrumbs} />;
  };

  handleRedirect = () => history.replace(cohortsRoute());

  handleMakeCohortUnavailable = () => this.setState({ isUnavailable: true });

  handleMakeCohortAvailable = () => this.setState({ isUnavailable: false });

  handleRestoreCohort = () => {
    const {
      cohortDetails: { name, isOwner },
      match: {
        params: { id: cohortId }
      },
      restoreCohort
    } = this.props;

    if (isOwner) {
      this.setState({ pendingForCohortRestoration: true });

      restoreCohort(cohortId, name)
        .then(this.handleMakeCohortAvailable)
        .finally(() => this.setState({ pendingForCohortRestoration: false }));
    }
  };

  render() {
    const {
      archivedLists,
      cohortDetails,
      intl: { formatMessage },
      lists,
      match: {
        params: { id: cohortId }
      },
      members,
      viewType
    } = this.props;

    if (!cohortDetails) {
      return null;
    }

    const {
      externalAction,
      isArchived,
      isDeleted,
      isOwner,
      name
    } = cohortDetails;
    const {
      areArchivedListsVisible,
      dialogContext,
      isUnavailable,
      pendingForArchivedLists,
      pendingForCohortArchivization,
      pendingForCohortRestoration,
      pendingForDetails,
      pendingForListCreation
    } = this.state;
    const isDialogForRemovedListVisible =
      isUnavailable && externalAction && !pendingForCohortArchivization;
    const archivedCohortView = (isArchived && !isUnavailable) || isDeleted;
    const dialogContextMessage = formatMessage({
      id: 'cohort.label'
    });
    const dialogTitle = formatMessage(
      {
        id: 'common.actions.not-available'
      },
      { context: dialogContextMessage, name }
    );
    const performerFormattedName = formatName(
      externalAction.performer,
      formatMessage
    );

    return (
      <Fragment>
        {this.renderBreadcrumbs()}
        {dialogContext === DialogContext.ARCHIVE && (
          <Dialog
            onCancel={this.handleDialogContext(null)}
            onConfirm={this.handleCohortArchivization()}
            pending={pendingForCohortArchivization}
            title={formatMessage(
              {
                id: pendingForCohortArchivization
                  ? 'cohort.index.archivization'
                  : 'cohort.index.archive'
              },
              { name }
            )}
          />
        )}
        {dialogContext === DialogContext.CREATE && (
          <FormDialog
            onCancel={this.handleDialogContext(null)}
            onConfirm={this.handleListCreation}
            pending={pendingForListCreation}
            title={formatMessage({
              id: pendingForListCreation
                ? 'cohort.index.adding-sack'
                : 'cohort.index.add-sack'
            })}
            onSelect={this.handleListType}
          />
        )}
        {archivedCohortView ? (
          <ArchivedCohort cohortId={cohortId} isOwner={isOwner} name={name} />
        ) : (
          <div className="wrapper">
            <div className="cohort">
              <CohortHeader
                details={cohortDetails}
                updateBreadcrumbs={this.handleBreadcrumbs}
              />
              <div className="cohort__details">
                <MembersBox
                  isCurrentUserAnOwner={isOwner}
                  members={members}
                  onCohortLeave={this.handleLeave}
                  route={Routes.COHORT}
                />
                <CollectionView
                  color={ColorType.ORANGE}
                  icon={<ListIcon />}
                  items={lists}
                  name="Sacks"
                  onAddNew={this.handleDialogContext(DialogContext.CREATE)}
                  placeholder={formatMessage(
                    {
                      id: 'cohort.index.no-sacks'
                    },
                    { name }
                  )}
                  route={Routes.LIST}
                  viewType={viewType}
                />
                {!isArchived && isOwner && (
                  <button
                    className="link-button"
                    onClick={this.handleDialogContext(DialogContext.ARCHIVE)}
                    type="button"
                  >
                    <FormattedMessage
                      id="cohort.index.archive-button"
                      values={{ name }}
                    />
                  </button>
                )}
                <div>
                  <button
                    className="link-button"
                    disabled={pendingForDetails}
                    onClick={this.handleArchivedListsVisibility(cohortId)}
                    type="button"
                  >
                    <FormattedMessage
                      id={
                        areArchivedListsVisible
                          ? 'cohort.index.hide-archived'
                          : 'cohort.index.show-archived'
                      }
                    />
                  </button>
                  {areArchivedListsVisible && (
                    <CollectionView
                      color={ColorType.GRAY}
                      icon={<ListIcon />}
                      items={archivedLists}
                      name="Archived Sacks"
                      pending={pendingForArchivedLists}
                      placeholder={formatMessage(
                        { id: 'cohort.index.no-archived-sacks' },
                        { name }
                      )}
                      route={Routes.LIST}
                      viewType={viewType}
                    />
                  )}
                </div>
                {pendingForDetails && <Preloader />}
              </div>
            </div>
          </div>
        )}
        {isDialogForRemovedListVisible && (
          <Dialog
            cancelLabel="common.button.cohorts"
            confirmLabel="common.button.restore"
            hasPermissions={isOwner}
            onCancel={this.handleRedirect}
            onConfirm={
              isArchived && !isDeleted ? this.handleRestoreCohort : undefined
            }
            pending={pendingForCohortRestoration}
            title={dialogTitle}
          >
            <p>
              <FormattedMessage
                id={externalAction.messageId}
                values={{
                  context: dialogContextMessage,
                  name,
                  performer: performerFormattedName
                }}
              />
              {!isOwner && (
                <Fragment>
                  {' '}
                  <FormattedMessage
                    id="common.actions.not-available-contact-owner"
                    values={{ context: dialogContextMessage, name }}
                  />
                </Fragment>
              )}
            </p>
          </Dialog>
        )}
      </Fragment>
    );
  }
}

Cohort.propTypes = {
  archivedLists: PropTypes.objectOf(PropTypes.object),
  cohortDetails: PropTypes.shape({
    description: PropTypes.string,
    externalAction: PropTypes.shape({
      messageId: PropTypes.string.isRequired,
      performer: PropTypes.string.isRequired
    }),
    isDeleted: PropTypes.bool,
    isArchived: PropTypes.bool,
    name: PropTypes.string
  }),
  currentUser: UserPropType.isRequired,
  intl: IntlPropType.isRequired,
  lists: PropTypes.objectOf(PropTypes.object),
  match: RouterMatchPropType.isRequired,
  members: PropTypes.objectOf(PropTypes.object),
  viewType: PropTypes.string.isRequired,

  archiveCohort: PropTypes.func.isRequired,
  createList: PropTypes.func.isRequired,
  fetchArchivedListsMetaData: PropTypes.func.isRequired,
  fetchCohortDetails: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  leaveCohort: PropTypes.func.isRequired,
  removeArchivedListsMetaData: PropTypes.func.isRequired,
  restoreCohort: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { id }
    }
  } = ownProps;

  return {
    archivedLists: getCohortArchivedLists(state, id),
    cohortDetails: getCohortDetails(state, id),
    currentUser: getCurrentUser(state),
    lists: getCohortActiveLists(state, id),
    members: getMembers(state, id)
  };
};

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    {
      archiveCohort,
      createList,
      fetchArchivedListsMetaData,
      fetchCohortDetails,
      fetchListsMetaData,
      leaveCohort,
      removeArchivedListsMetaData,
      restoreCohort
    }
  )
)(Cohort);
