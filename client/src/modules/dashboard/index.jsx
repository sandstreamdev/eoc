import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar, { ToolbarItem, ToolbarLink } from 'common/components/Toolbar';
import { ArchiveIcon, CohortIcon, ListIcon } from 'assets/images/icons';
import PlusIcon from 'assets/images/plus-solid.svg';
import EyeIcon from 'assets/images/eye-solid.svg';
import CreationForm from 'common/components/CreationForm';
import {
  createList,
  fetchShoppingListsMetaData
} from 'modules/shopping-list/model/actions';
import {
  createCohort,
  fetchCohortsMetaData
} from 'modules/cohort/model/actions';
import { getShoppingLists } from 'modules/shopping-list/model/selectors';
import { getCohorts } from 'modules/cohort/model/selectors';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import GridList from 'common/components/GridList';

class Dashboard extends Component {
  state = {
    cohortFormVisibility: false,
    shoppingFormVisibility: false
  };

  componentDidMount() {
    const { fetchCohortsMetaData, fetchShoppingListsMetaData } = this.props;

    fetchCohortsMetaData();
    fetchShoppingListsMetaData();
  }

  hideForms = () => {
    this.setState({
      cohortFormVisibility: false,
      shoppingFormVisibility: false
    });
  };

  handleShoppingListFormVisibility = () => {
    const { shoppingFormVisibility } = this.state;

    this.setState({
      cohortFormVisibility: false,
      shoppingFormVisibility: !shoppingFormVisibility
    });
  };

  handleCohortFormVisibility = () => {
    const { cohortFormVisibility } = this.state;

    this.setState({
      cohortFormVisibility: !cohortFormVisibility,
      shoppingFormVisibility: false
    });
  };

  handleShoppingListSubmission = (title, description) => {
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

  renderCreateCohortForm = () => {
    const { cohortFormVisibility } = this.state;
    return (
      cohortFormVisibility && (
        <CreationForm
          label="Create new cohort"
          onSubmit={this.handleCohortSubmission}
          type="menu"
          onHide={this.hideForms}
        />
      )
    );
  };

  renderCreateListForm = () => {
    const { shoppingFormVisibility } = this.state;
    return (
      shoppingFormVisibility && (
        <CreationForm
          label="Create new list"
          onSubmit={this.handleShoppingListSubmission}
          type="menu"
          onHide={this.hideForms}
        />
      )
    );
  };

  render() {
    const { shoppingLists, cohorts } = this.props;

    return (
      <Fragment>
        <Toolbar isHomePage>
          <ToolbarItem
            additionalIconSrc={PlusIcon}
            mainIcon={<CohortIcon />}
            onClick={this.handleCohortFormVisibility}
          >
            {this.renderCreateCohortForm()}
          </ToolbarItem>
          <ToolbarItem
            additionalIconSrc={PlusIcon}
            mainIcon={<ListIcon />}
            onClick={this.handleShoppingListFormVisibility}
          >
            {this.renderCreateListForm()}
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
              icon={<ListIcon />}
              items={shoppingLists}
              name="Lists"
              placeholder="There are no lists yet!"
              route="list"
            />
            <GridList
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
  shoppingLists: PropTypes.objectOf(PropTypes.object),

  createCohort: PropTypes.func.isRequired,
  createList: PropTypes.func.isRequired,
  fetchCohortsMetaData: PropTypes.func.isRequired,
  fetchShoppingListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohorts: getCohorts(state),
  currentUser: getCurrentUser(state),
  shoppingLists: getShoppingLists(state)
});

export default connect(
  mapStateToProps,
  {
    createCohort,
    createList,
    fetchShoppingListsMetaData,
    fetchCohortsMetaData
  }
)(Dashboard);
