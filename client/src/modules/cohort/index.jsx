import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';

import CardItem, { CardColorType } from 'common/components/CardItem';
import MessageBox from 'common/components/MessageBox';
import Toolbar, { ToolbarItem } from 'common/components/Toolbar';
import { getCohortLists } from 'modules/shopping-list/model/selectors';
import {
  createList,
  fetchListsMetaData
} from 'modules/shopping-list/model/actions';
import {
  ArchiveIcon,
  CohortIcon,
  EditIcon,
  ListIcon
} from 'assets/images/icons';
import { getCohortDetails } from './model/selectors';
import { MessageType } from 'common/constants/enums';
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

class Cohort extends PureComponent {
  state = {
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
              />
              <ToolbarItem
                mainIcon={<ArchiveIcon />}
                onClick={this.showDialog}
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
              <h2 className="cohort__heading">
                <CohortIcon />
                {name}
              </h2>
              <p className="cohort__description">{description}</p>
              {_isEmpty(lists) ? (
                <MessageBox
                  message={`There are no lists in the ${name} cohort!`}
                  type={MessageType.INFO}
                />
              ) : (
                <ul className="cohort-list">
                  {_map(lists, list => (
                    <li className="cohort-list__item" key={list._id}>
                      <Link to={`/list/${list._id}`}>
                        <CardItem
                          color={CardColorType.ORANGE}
                          description={list.description}
                          name={list.name}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
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
