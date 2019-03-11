import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar, { ToolbarItem, ToolbarLink } from 'common/components/Toolbar';
import { ArchiveIcon, CohortIcon, ListIcon } from 'assets/images/icons';
import PlusIcon from 'assets/images/plus-solid.svg';
import EyeIcon from 'assets/images/eye-solid.svg';
import {
  createList,
  fetchListsMetaData
} from 'modules/shopping-list/model/actions';
import {
  createCohort,
  fetchCohortsMetaData
} from 'modules/cohort/model/actions';
import { getLists } from 'modules/shopping-list/model/selectors';
import { getCohorts } from 'modules/cohort/model/selectors';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import GridList from 'common/components/GridList';
import DropdownForm from 'common/components/DropdownForm';
import { CardColorType } from 'common/components/CardItem';

class Dashboard extends Component {
  state = {
    cohortFormVisibility: false,
    listFormVisibility: false
  };

  componentDidMount() {
    const { fetchCohortsMetaData, fetchListsMetaData } = this.props;

    fetchCohortsMetaData();
    fetchListsMetaData();
  }

  hideForms = () => {
    this.setState({
      cohortFormVisibility: false,
      listFormVisibility: false
    });
  };

  handleListFormVisibility = () => {
    const { listFormVisibility } = this.state;

    this.setState({
      cohortFormVisibility: false,
      listFormVisibility: !listFormVisibility
    });
  };

  handleCohortFormVisibility = () => {
    const { cohortFormVisibility } = this.state;

    this.setState({
      cohortFormVisibility: !cohortFormVisibility,
      listFormVisibility: false
    });
  };

  handleListSubmission = (title, description) => {
    const {
      createList,
      currentUser: { id }
    } = this.props;
    createList(title, description, id);
    this.hideForms();
  };

  handleCohortSubmission = (title, description) => {
    const {
      createCohort,
      currentUser: { id }
    } = this.props;
    createCohort(title, description, id);
    this.hideForms();
  };

  render() {
    const { lists, cohorts } = this.props;
    const { cohortFormVisibility, listFormVisibility } = this.state;

    return (
      <Fragment>
        <Toolbar isHomePage>
          <ToolbarItem
            additionalIconSrc={PlusIcon}
            mainIcon={<CohortIcon />}
            onClick={this.handleCohortFormVisibility}
          >
            <DropdownForm
              isVisible={cohortFormVisibility}
              label="Create new cohort"
              onHide={this.hideForms}
              onSubmit={this.handleCohortSubmission}
              type="menu"
            />
          </ToolbarItem>
          <ToolbarItem
            additionalIconSrc={PlusIcon}
            mainIcon={<ListIcon />}
            onClick={this.handleListFormVisibility}
          >
            <DropdownForm
              isVisible={listFormVisibility}
              label="Create new list"
              onHide={this.hideForms}
              onSubmit={this.handleListSubmission}
              type="menu"
            />
          </ToolbarItem>
          <ToolbarLink
            additionalIconSrc={EyeIcon}
            mainIcon={<ArchiveIcon />}
            path="/archived"
          />
        </Toolbar>
        <div className="wrapper">
          <div className="dashboard">
            <GridList
              color={CardColorType.ORANGE}
              icon={<ListIcon />}
              items={lists}
              name="Lists"
              placeholder="There are no lists yet!"
              route="list"
            />
            <GridList
              color={CardColorType.BROWN}
              icon={<CohortIcon />}
              items={cohorts}
              name="Cohorts"
              placeholder="There are no cohorts yet!"
              route="cohort"
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  cohorts: PropTypes.objectOf(PropTypes.object),
  currentUser: UserPropType.isRequired,
  lists: PropTypes.objectOf(PropTypes.object),

  createCohort: PropTypes.func.isRequired,
  createList: PropTypes.func.isRequired,
  fetchCohortsMetaData: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohorts: getCohorts(state),
  currentUser: getCurrentUser(state),
  lists: getLists(state)
});

export default connect(
  mapStateToProps,
  {
    createCohort,
    createList,
    fetchListsMetaData,
    fetchCohortsMetaData
  }
)(Dashboard);
