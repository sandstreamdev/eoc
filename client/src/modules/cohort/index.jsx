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
  leaveCohort
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
import { getCurrentUser } from 'modules/authorization/model/selectors';

class Cohort extends PureComponent {
  state = {
    areArchivedListsVisible: false,
    breadcrumbs: [],
    dialogContext: null,
    pendingForArchivedLists: false,
    pendingForDetails: false,
    pendingForListCreation: false,
    pendingForCohortArchivization: false,
    type: ListType.LIMITED
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    const {
      match: {
        params: { id: prevId }
      }
    } = prevProps;

    if (id !== prevId) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const {
      fetchCohortDetails,
      fetchListsMetaData,
      match: {
        params: { id }
      }
    } = this.props;

    this.setState({ pendingForDetails: true });

    return fetchCohortDetails(id)
      .then(() => {
        if (!this.checkIfArchived()) {
          return fetchListsMetaData(id);
        }
      })
      .finally(() => {
        this.handleBreadcrumbs();
        this.setState({ pendingForDetails: false });
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
      this.setState({ pendingForListCreation: false });
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
      leaveCohort,
      match: {
        params: { id }
      }
    } = this.props;

    return leaveCohort(id, currentUserId, name);
  };

  renderBreadcrumbs = () => {
    const { breadcrumbs } = this.state;

    return <Breadcrumbs breadcrumbs={breadcrumbs} />;
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

    const { isArchived, isOwner, name } = cohortDetails;
    const {
      areArchivedListsVisible,
      dialogContext,
      pendingForArchivedLists,
      pendingForCohortArchivization,
      pendingForDetails,
      pendingForListCreation
    } = this.state;

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
        {isArchived ? (
          <ArchivedCohort cohortId={cohortId} name={name} />
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
      </Fragment>
    );
  }
}

Cohort.propTypes = {
  archivedLists: PropTypes.objectOf(PropTypes.object),
  cohortDetails: PropTypes.shape({
    description: PropTypes.string,
    isArchived: PropTypes.bool,
    name: PropTypes.string
  }),
  currentUser: UserPropType.isRequired,
  createList: PropTypes.func.isRequired,
  intl: IntlPropType.isRequired,
  lists: PropTypes.objectOf(PropTypes.object),
  match: RouterMatchPropType.isRequired,
  members: PropTypes.objectOf(PropTypes.object),
  viewType: PropTypes.string.isRequired,

  archiveCohort: PropTypes.func.isRequired,
  fetchArchivedListsMetaData: PropTypes.func.isRequired,
  fetchCohortDetails: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  leaveCohort: PropTypes.func.isRequired,
  removeArchivedListsMetaData: PropTypes.func.isRequired
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
      removeArchivedListsMetaData
    }
  )
)(Cohort);
