import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { CardColorType } from 'common/components/CardItem';
import Toolbar, { ToolbarItem } from 'common/components/Toolbar';
import { getActiveLists, getArchivedLists } from 'modules/list/model/selectors';
import {
  createList,
  fetchArchivedListsMetaData,
  fetchListsMetaData,
  removeArchivedListsMetaData
} from 'modules/list/model/actions';
import {
  ArchiveIcon,
  CohortIcon,
  EditIcon,
  ListIcon
} from 'assets/images/icons';
import { getCohortDetails } from './model/selectors';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import FormDialog from 'common/components/FormDialog';
import {
  archiveCohort,
  fetchCohortDetails,
  updateCohort
} from './model/actions';
import { noOp } from 'common/utils/noOp';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import Dialog, { DialogContext } from 'common/components/Dialog';
import ArchivedCohort from 'modules/cohort/components/ArchivedCohort';
import GridList, { GridListRoutes } from 'common/components/GridList';

class Cohort extends PureComponent {
  state = {
    areArchivedListVisible: false,
    dialogContext: null
  };

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

    fetchCohortDetails(id)
      .then(() => {
        if (!this.checkIfArchived()) {
          fetchListsMetaData(id);
        }
      })
      .catch(noOp);
  };

  handleListCreation = (name, description) => {
    const {
      createList,
      currentUser: { id: userId },
      match: {
        params: { id: cohortId }
      }
    } = this.props;
    createList(name, description, userId, cohortId)
      .then(this.hideDialog())
      .catch(noOp);
  };

  handleCohortEdition = cohortId => (name, description) => {
    const { cohortDetails, updateCohort } = this.props;
    const {
      description: previousDescription,
      name: previousName
    } = cohortDetails;

    if (previousDescription !== description || previousName !== name) {
      const dataToUpdate = { description, name };

      updateCohort(cohortId, dataToUpdate);
    }

    this.hideDialog();
  };

  handleCohortArchivization = cohortId => () => {
    const { archiveCohort } = this.props;
    archiveCohort(cohortId)
      .then(this.hideDialog())
      .catch(noOp);
  };

  checkIfArchived = () => {
    const { cohortDetails } = this.props;
    return cohortDetails && cohortDetails.isArchived;
  };

  checkIfAdmin = () => {
    const { cohortDetails } = this.props;
    return cohortDetails && cohortDetails.isAdmin;
  };

  handleDialogContext = context => () =>
    this.setState({ dialogContext: context });

  hideDialog = () => this.handleDialogContext(null)();

  handleArchivedListsVisibility = id => () => {
    const { areArchivedListVisible } = this.state;
    this.setState({ areArchivedListVisible: !areArchivedListVisible });
    this.handleArchivedListsData(id);
  };

  handleArchivedListsData = id => {
    const { areArchivedListVisible } = this.state;
    const {
      fetchArchivedListsMetaData,
      removeArchivedListsMetaData
    } = this.props;
    !areArchivedListVisible
      ? fetchArchivedListsMetaData(id)
      : removeArchivedListsMetaData();
  };

  render() {
    const {
      archivedLists,
      cohortDetails,
      lists,
      match: {
        params: { id: cohortId }
      }
    } = this.props;

    if (!cohortDetails) {
      return null;
    }

    const { isArchived, name, description } = cohortDetails;
    const { areArchivedListVisible, dialogContext } = this.state;

    return (
      <Fragment>
        <Toolbar>
          {!isArchived && this.checkIfAdmin() && (
            <Fragment>
              <ToolbarItem
                mainIcon={<EditIcon />}
                onClick={this.handleDialogContext(DialogContext.UPDATE)}
                title="Update cohort"
              />
              <ToolbarItem
                mainIcon={<ArchiveIcon />}
                onClick={this.handleDialogContext(DialogContext.ARCHIVE)}
                title="Archive cohort"
              />
            </Fragment>
          )}
        </Toolbar>
        {dialogContext === DialogContext.ARCHIVE && (
          <Dialog
            onCancel={this.handleDialogContext(null)}
            onConfirm={this.handleCohortArchivization(cohortId)}
            title={`Do you really want to archive the ${name} cohort?`}
          />
        )}
        {dialogContext === DialogContext.UPDATE && (
          <FormDialog
            defaultDescription={description}
            defaultName={name}
            onCancel={this.handleDialogContext(null)}
            onConfirm={this.handleCohortEdition(cohortId)}
            title="Edit cohort"
          />
        )}
        {dialogContext === DialogContext.CREATE && (
          <FormDialog
            onCancel={this.handleDialogContext(null)}
            onConfirm={this.handleListCreation}
            title="Add new list"
          />
        )}
        {isArchived ? (
          <ArchivedCohort cohortId={cohortId} name={name} />
        ) : (
          <div className="wrapper">
            <div className="cohort">
              <h1 className="cohort__heading">
                <CohortIcon />
                {name}
              </h1>
              <p className="cohort__description">{description}</p>
              <GridList
                color={CardColorType.ORANGE}
                icon={<ListIcon />}
                items={lists}
                name="Lists"
                onAddNew={this.handleDialogContext(DialogContext.CREATE)}
                placeholder={`There are no lists in the ${name} cohort!`}
                route={GridListRoutes.LIST}
              />
              <button
                className="cohort__toggle-archived-lists"
                onClick={this.handleArchivedListsVisibility(cohortId)}
                type="button"
              >
                {` ${areArchivedListVisible ? 'hide' : 'show'} archived lists`}
              </button>
              {areArchivedListVisible && (
                <GridList
                  color={CardColorType.ARCHIVED}
                  icon={<ListIcon />}
                  items={archivedLists}
                  name="Archived lists"
                  placeholder={`There are no archived lists in the ${name} cohort!`}
                  route={GridListRoutes.LIST}
                />
              )}
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
  currentUser: UserPropType.isRequired,
  lists: PropTypes.objectOf(PropTypes.object),
  match: RouterMatchPropType.isRequired,

  archiveCohort: PropTypes.func.isRequired,
  fetchArchivedListsMetaData: PropTypes.func.isRequired,
  fetchCohortDetails: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  removeArchivedListsMetaData: PropTypes.func.isRequired,
  updateCohort: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  archivedLists: getArchivedLists(state),
  cohortDetails: getCohortDetails(state, ownProps.match.params.id),
  currentUser: getCurrentUser(state),
  lists: getActiveLists(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      archiveCohort,
      createList,
      fetchArchivedListsMetaData,
      fetchCohortDetails,
      fetchListsMetaData,
      removeArchivedListsMetaData,
      updateCohort
    }
  )(Cohort)
);
