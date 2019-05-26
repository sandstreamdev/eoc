import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

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
import { RouterMatchPropType } from 'common/constants/propTypes';
import FormDialog from 'common/components/FormDialog';
import { archiveCohort, fetchCohortDetails } from './model/actions';
import Dialog, { DialogContext } from 'common/components/Dialog';
import ArchivedCohort from 'modules/cohort/components/ArchivedCohort';
import CollectionView from 'common/components/CollectionView';
import { ListType } from 'modules/list/consts';
import MembersBox from 'common/components/Members';
import { ColorType, Routes } from 'common/constants/enums';
import CohortHeader from './components/CohortHeader';
import Preloader from 'common/components/Preloader';

class Cohort extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      areArchivedListsVisible: false,
      dialogContext: null,
      pendingForArchivedLists: false,
      pendingForDetails: false,
      pendingForListCreation: false,
      pendingForCohortArchivization: false,
      type: ListType.LIMITED
    };
  }

  componentDidMount() {
    this.fetchData();
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

    fetchCohortDetails(id)
      .then(() => {
        if (!this.checkIfArchived()) {
          return fetchListsMetaData(id);
        }
      })
      .finally(() => this.setState({ pendingForDetails: false }));
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
      match: {
        params: { id }
      }
    } = this.props;

    this.setState({ pendingForCohortArchivization: true });

    archiveCohort(id).finally(() => {
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

  render() {
    const {
      archivedLists,
      cohortDetails,
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
        {dialogContext === DialogContext.ARCHIVE && (
          <Dialog
            onCancel={this.handleDialogContext(null)}
            onConfirm={this.handleCohortArchivization()}
            pending={pendingForCohortArchivization}
            title={
              pendingForCohortArchivization
                ? `"${name}" cohort archivization...`
                : `Do you really want to archive the "${name}" cohort?`
            }
          />
        )}
        {dialogContext === DialogContext.CREATE && (
          <FormDialog
            onCancel={this.handleDialogContext(null)}
            onConfirm={this.handleListCreation}
            pending={pendingForListCreation}
            title={`${pendingForListCreation ? 'Adding' : 'Add'} new sack`}
            onSelect={this.handleListType}
          />
        )}
        {isArchived ? (
          <ArchivedCohort cohortId={cohortId} name={name} />
        ) : (
          <div className="wrapper">
            <div className="cohort">
              <CohortHeader details={cohortDetails} />
              <div className="cohort__details">
                <MembersBox
                  isCurrentUserAnOwner={isOwner}
                  members={members}
                  route={Routes.COHORT}
                />
                <CollectionView
                  color={ColorType.ORANGE}
                  icon={<ListIcon />}
                  items={lists}
                  name="Sacks"
                  onAddNew={this.handleDialogContext(DialogContext.CREATE)}
                  placeholder={`There are no sacks in the ${name} cohort!`}
                  route={Routes.LIST}
                  viewType={viewType}
                />
                {!isArchived && isOwner && (
                  <button
                    className="link-button"
                    onClick={this.handleDialogContext(DialogContext.ARCHIVE)}
                    type="button"
                  >
                    {`Archive the "${name}" cohort`}
                  </button>
                )}
                <div>
                  <button
                    className="link-button"
                    disabled={pendingForDetails}
                    onClick={this.handleArchivedListsVisibility(cohortId)}
                    type="button"
                  >
                    {`${
                      areArchivedListsVisible ? 'hide' : 'show'
                    } archived sacks`}
                  </button>
                  {areArchivedListsVisible && (
                    <CollectionView
                      color={ColorType.GRAY}
                      icon={<ListIcon />}
                      items={archivedLists}
                      name="Archived Sacks"
                      pending={pendingForArchivedLists}
                      placeholder={`There are no archived sacks in the ${name} cohort!`}
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
  createList: PropTypes.func.isRequired,
  lists: PropTypes.objectOf(PropTypes.object),
  match: RouterMatchPropType.isRequired,
  members: PropTypes.objectOf(PropTypes.object),
  viewType: PropTypes.string.isRequired,

  archiveCohort: PropTypes.func.isRequired,
  fetchArchivedListsMetaData: PropTypes.func.isRequired,
  fetchCohortDetails: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
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
    lists: getCohortActiveLists(state, id),
    members: getMembers(state, id)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      archiveCohort,
      createList,
      fetchArchivedListsMetaData,
      fetchCohortDetails,
      fetchListsMetaData,
      removeArchivedListsMetaData
    }
  )(Cohort)
);
