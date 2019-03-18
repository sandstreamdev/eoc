import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { CardColorType } from 'common/components/CardItem';
import Toolbar, { ToolbarItem } from 'common/components/Toolbar';
import {
  getCohortArchivedLists,
  getCohortLists
} from 'modules/list/model/selectors';
import {
  createList,
  fetchArchivedListsMetaData,
  fetchListsMetaData,
  removeArchivedLists
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
import DropdownForm from 'common/components/DropdownForm';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import PlusIcon from 'assets/images/plus-solid.svg';
import Dialog from 'common/components/Dialog';
import ArchivedCohort from 'modules/cohort/components/ArchivedCohort';
import GridList from 'common/components/GridList';

class Cohort extends PureComponent {
  state = {
    areArchivedListVisible: false,
    isListFormVisible: false,
    isDialogVisible: false,
    isUpdateFormVisible: false
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

  hideListCreationForm = () => {
    this.setState({ isListFormVisible: false });
  };

  showListCreationForm = () => {
    this.setState({ isListFormVisible: true });
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
      .then(this.hideListCreationForm)
      .catch(noOp);
  };

  showUpdateForm = () => this.setState({ isUpdateFormVisible: true });

  hideUpdateForm = () => this.setState({ isUpdateFormVisible: false });

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
    this.hideUpdateForm();
  };

  showDialog = () => this.setState({ isDialogVisible: true });

  hideDialog = () => this.setState({ isDialogVisible: false });

  handleCohortArchivization = cohortId => () => {
    const { archiveCohort } = this.props;
    archiveCohort(cohortId)
      .then(this.hideDialog)
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

  handleArchivedListVisibility = id => () => {
    const { areArchivedListVisible } = this.state;
    const { fetchArchivedListsMetaData, removeArchivedLists } = this.props;
    this.setState({ areArchivedListVisible: !areArchivedListVisible });
    !areArchivedListVisible
      ? fetchArchivedListsMetaData(id)
      : removeArchivedLists();
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
    const {
      areArchivedListVisible,
      isListFormVisible,
      isDialogVisible,
      isUpdateFormVisible
    } = this.state;

    return (
      <Fragment>
        <Toolbar>
          {!isArchived && this.checkIfAdmin() && (
            <Fragment>
              <ToolbarItem
                additionalIconSrc={PlusIcon}
                mainIcon={<ListIcon />}
                onClick={this.showListCreationForm}
                title="Create new list"
              >
                <DropdownForm
                  isVisible={isListFormVisible}
                  label="Create new list"
                  onHide={this.hideListCreationForm}
                  onSubmit={this.handleListCreation}
                  type="menu"
                />
              </ToolbarItem>
              <ToolbarItem
                mainIcon={<EditIcon />}
                onClick={this.showUpdateForm}
                title="Update cohort"
              />
              <ToolbarItem
                mainIcon={<ArchiveIcon />}
                onClick={this.showDialog}
                title="Archive cohort"
              />
            </Fragment>
          )}
        </Toolbar>
        {isDialogVisible && (
          <Dialog
            title={`Do you really want to archive the ${name} cohort?`}
            onCancel={this.hideDialog}
            onConfirm={this.handleCohortArchivization(cohortId)}
          />
        )}
        {isUpdateFormVisible && (
          <FormDialog
            defaultDescription={description}
            defaultName={name}
            title="Edit cohort"
            onCancel={this.hideUpdateForm}
            onConfirm={this.handleCohortEdition(cohortId)}
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
                placeholder={`There are no lists in the ${name} cohort!`}
                route="list"
              />
              <button
                className="cohort__toggle-archived-lists"
                onClick={this.handleArchivedListVisibility(cohortId)}
                type="button"
              >
                {` ${areArchivedListVisible ? 'hide' : 'show'} archived lists`}
              </button>
              {areArchivedListVisible && (
                <GridList
                  color={CardColorType.GRAY}
                  icon={<ListIcon />}
                  items={archivedLists}
                  name="Archived lists"
                  placeholder={`There are no archived lists in the ${name} cohort!`}
                  route="list"
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
  removeArchivedLists: PropTypes.func.isRequired,
  updateCohort: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  cohortDetails: getCohortDetails(state, ownProps.match.params.id),
  currentUser: getCurrentUser(state),
  lists: getCohortLists(state, ownProps.match.params.id),
  archivedLists: getCohortArchivedLists(state, ownProps.match.params.id)
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
      removeArchivedLists,
      updateCohort
    }
  )(Cohort)
);
