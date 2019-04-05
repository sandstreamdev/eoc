import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar from 'common/components/Toolbar';
import { CohortIcon } from 'assets/images/icons';
import {
  createCohort,
  fetchArchivedCohortsMetaData,
  fetchCohortsMetaData,
  removeArchivedCohortsMetaData
} from 'modules/cohort/model/actions';
import {
  getActiveCohorts,
  getArchivedCohorts
} from 'modules/cohort/model/selectors';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import GridList from 'common/components/GridList';
import { CardColorType } from 'common/components/CardItem';
import FormDialog from 'common/components/FormDialog';
import { Routes } from 'common/constants/enums';

class Cohorts extends Component {
  state = {
    showArchivedCohorts: false,
    isDialogVisible: false
  };

  componentDidMount() {
    const { fetchCohortsMetaData } = this.props;

    fetchCohortsMetaData();
  }

  handleDialogVisibility = () =>
    this.setState(({ isDialogVisible }) => ({
      isDialogVisible: !isDialogVisible
    }));

  handleConfirm = (name, description) => {
    const {
      createCohort,
      currentUser: { id: userId }
    } = this.props;
    const data = { description, userId, name };
    createCohort(data);
    this.handleDialogVisibility();
  };

  handleArchivedCohortsVisibility = () => {
    this.setState(
      ({ showArchivedCohorts }) => ({
        showArchivedCohorts: !showArchivedCohorts
      }),
      () => this.handleArchivedCohortsData()
    );
  };

  handleArchivedCohortsData = () => {
    const { showArchivedCohorts } = this.state;
    const {
      fetchArchivedCohortsMetaData,
      removeArchivedCohortsMetaData
    } = this.props;
    const action = showArchivedCohorts
      ? fetchArchivedCohortsMetaData
      : removeArchivedCohortsMetaData;
    action();
  };

  render() {
    const { archivedCohorts, cohorts } = this.props;
    const { showArchivedCohorts, isDialogVisible } = this.state;

    return (
      <Fragment>
        <Toolbar />
        <div className="wrapper">
          <div className="dashboard">
            <GridList
              color={CardColorType.BROWN}
              icon={<CohortIcon />}
              items={cohorts}
              name="Cohorts"
              onAddNew={this.handleDialogVisibility}
              placeholder="There are no cohorts yet!"
              route={Routes.COHORT}
            />
            <button
              className="link-button"
              onClick={this.handleArchivedCohortsVisibility}
              type="button"
            >
              {` ${showArchivedCohorts ? 'hide' : 'show'} archived cohorts`}
            </button>
            {showArchivedCohorts && (
              <GridList
                color={CardColorType.ARCHIVED}
                icon={<CohortIcon />}
                items={archivedCohorts}
                name="Archived cohorts"
                placeholder="You have no archived cohorts!"
                route={Routes.COHORT}
              />
            )}
          </div>
        </div>
        {isDialogVisible && (
          <FormDialog
            onCancel={this.handleDialogVisibility}
            onConfirm={this.handleConfirm}
            title="Add new cohort"
          />
        )}
      </Fragment>
    );
  }
}

Cohorts.propTypes = {
  archivedCohorts: PropTypes.objectOf(PropTypes.object),
  cohorts: PropTypes.objectOf(PropTypes.object),
  currentUser: UserPropType.isRequired,

  createCohort: PropTypes.func.isRequired,
  fetchArchivedCohortsMetaData: PropTypes.func.isRequired,
  fetchCohortsMetaData: PropTypes.func.isRequired,
  removeArchivedCohortsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  archivedCohorts: getArchivedCohorts(state),
  cohorts: getActiveCohorts(state),
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  {
    createCohort,
    fetchArchivedCohortsMetaData,
    fetchCohortsMetaData,
    removeArchivedCohortsMetaData
  }
)(Cohorts);
