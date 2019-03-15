import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CardColorType } from 'common/components/CardItem';
import Toolbar, { ToolbarItem } from 'common/components/Toolbar';
import { getCohortLists } from 'modules/list/model/selectors';
import { createList, fetchListsMetaData } from 'modules/list/model/actions';
import { ArchiveIcon, CohortIcon, EditIcon } from 'assets/images/icons';
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
import Dialog from 'common/components/Dialog';
import ArchivedCohort from 'modules/cohort/components/ArchivedCohort';
import GridList from 'common/components/GridList';

class Cohort extends PureComponent {
  state = {
    isCreationFormVisible: false,
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

  handleListCreation = (name, description) => {
    const {
      createList,
      currentUser: { id: userId },
      match: {
        params: { id: cohortId }
      }
    } = this.props;
    createList(name, description, userId, cohortId)
      .then(this.handleFormDialogVisibility)
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

  handleFormDialogVisibility = () => {
    const { isCreationFormVisible } = this.state;

    isCreationFormVisible
      ? this.setState({
          isCreationFormVisible: false
        })
      : this.setState({
          isCreationFormVisible: true
        });
  };

  render() {
    const {
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
      isCreationFormVisible,
      isDialogVisible,
      isUpdateFormVisible
    } = this.state;

    return (
      <Fragment>
        <Toolbar>
          {!isArchived && this.checkIfAdmin() && (
            <Fragment>
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
            onConfirm={this.handleFormSubmission(cohortId)}
          />
        )}
        {isCreationFormVisible && (
          <FormDialog
            isNameRequired
            onCancel={this.handleFormDialogVisibility}
            onConfirm={this.handleListCreation}
            title="Add new list"
          />
        )}
        {isCreationFormVisible && (
          <FormDialog
            isNameRequired
            onCancel={this.handleFormDialogVisibility}
            onConfirm={this.handleListCreation}
            title="Add new list"
          />
        )}
        {isArchived ? (
          <ArchivedCohort cohortId={cohortId} name={name} />
        ) : (
          <div className="wrapper">
            <div className="cohort">
              <GridList
                color={CardColorType.ORANGE}
                description={description}
                icon={<CohortIcon />}
                items={lists}
                name={name}
                onAddNew={this.handleFormDialogVisibility}
                placeholder="There are no lists yet!"
                route="list"
                withCreateNewTile
              />
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

Cohort.propTypes = {
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
  fetchCohortDetails: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  updateCohort: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  cohortDetails: getCohortDetails(state, ownProps.match.params.id),
  currentUser: getCurrentUser(state),
  lists: getCohortLists(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      archiveCohort,
      createList,
      fetchCohortDetails,
      fetchListsMetaData,
      updateCohort
    }
  )(Cohort)
);
