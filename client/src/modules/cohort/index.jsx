import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { CardColorType } from 'common/components/CardItem';
import Toolbar from 'common/components/Toolbar';
import { getActiveLists, getArchivedLists } from 'modules/list/model/selectors';
import {
  createList,
  fetchArchivedListsMetaData,
  fetchListsMetaData,
  removeArchivedListsMetaData
} from 'modules/list/model/actions';
import { ListIcon } from 'assets/images/icons';
import { getCohortDetails, getMembers } from './model/selectors';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import FormDialog from 'common/components/FormDialog';
import { archiveCohort, fetchCohortDetails } from './model/actions';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import Dialog, { DialogContext } from 'common/components/Dialog';
import ArchivedCohort from 'modules/cohort/components/ArchivedCohort';
import GridList from 'common/components/GridList';
import { ListType } from 'modules/list';
import MembersBox from 'common/components/Members';
import { Routes } from 'common/constants/enums';
import { noOp } from 'common/utils/noOp';
import CohortHeader from './components/CohortHeader';

class Cohort extends PureComponent {
  state = {
    areArchivedListVisible: false,
    dialogContext: null,
    isListPrivate: true
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

    const { isListPrivate } = this.state;
    const data = { name, description, userId, cohortId, isListPrivate };

    createList(data)
      .then(this.hideDialog())
      .catch(noOp);
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

  checkIfOwner = () => {
    const { cohortDetails } = this.props;
    if (cohortDetails && cohortDetails.isOwner) {
      return true;
    }
    return false;
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

  handleListType = isPrivate =>
    this.setState({ isListPrivate: isPrivate === ListType.PRIVATE });

  handleListType = isPrivate =>
    this.setState({ isListPrivate: isPrivate === ListType.PRIVATE });

  render() {
    const {
      archivedLists,
      cohortDetails,
      lists,
      match: {
        params: { id: cohortId }
      },
      members
    } = this.props;

    if (!cohortDetails) {
      return null;
    }

    const { isArchived, name } = cohortDetails;
    const { areArchivedListVisible, dialogContext } = this.state;

    return (
      <Fragment>
        <Toolbar />
        {dialogContext === DialogContext.ARCHIVE && (
          <Dialog
            onCancel={this.handleDialogContext(null)}
            onConfirm={this.handleCohortArchivization(cohortId)}
            title={`Do you really want to archive the "${name}" cohort?`}
          />
        )}
        {dialogContext === DialogContext.CREATE && (
          <FormDialog
            onCancel={this.handleDialogContext(null)}
            onConfirm={this.handleListCreation}
            title="Add new list"
            onSelect={this.handleListType}
          />
        )}
        {isArchived ? (
          <ArchivedCohort cohortId={cohortId} name={name} />
        ) : (
          <div className="wrapper">
            <div className="cohort">
              <CohortHeader details={cohortDetails} />
              <MembersBox
                isCurrentUserAnOwner={this.checkIfOwner()}
                members={members}
                route={Routes.COHORT}
              />
              <GridList
                color={CardColorType.ORANGE}
                icon={<ListIcon />}
                items={lists}
                name="Lists"
                onAddNew={this.handleDialogContext(DialogContext.CREATE)}
                placeholder={`There are no lists in the ${name} cohort!`}
                route={Routes.LIST}
              />
              {!isArchived && this.checkIfOwner() && (
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
                  onClick={this.handleArchivedListsVisibility(cohortId)}
                  type="button"
                >
                  {` ${
                    areArchivedListVisible ? 'hide' : 'show'
                  } archived lists`}
                </button>
                {areArchivedListVisible && (
                  <GridList
                    color={CardColorType.ARCHIVED}
                    icon={<ListIcon />}
                    items={archivedLists}
                    name="Archived lists"
                    placeholder={`There are no archived lists in the ${name} cohort!`}
                    route={Routes.LIST}
                  />
                )}
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
  currentUser: UserPropType.isRequired,
  lists: PropTypes.objectOf(PropTypes.object),
  match: RouterMatchPropType.isRequired,
  members: PropTypes.objectOf(PropTypes.object),

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
    archivedLists: getArchivedLists(state),
    cohortDetails: getCohortDetails(state, id),
    currentUser: getCurrentUser(state),
    lists: getActiveLists(state),
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
