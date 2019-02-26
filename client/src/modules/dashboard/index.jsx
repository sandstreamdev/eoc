import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar, { ToolbarItem, ToolbarLink } from 'common/components/Toolbar';
import { ArchiveIcon, CohortIcon, ListIcon } from 'assets/images/icons';
import PlusIcon from 'assets/images/plus-solid.svg';
import EyeIcon from 'assets/images/eye-solid.svg';
import CreationForm from 'common/components/CreationForm';
import {
  createShoppingList,
  fetchShoppingListsMetaData
} from 'modules/shopping-list/model/actions';
import { createCohort, fetchCohorts } from 'modules/cohort/model/actions';
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
    const { fetchShoppingListsMetaData, fetchCohorts } = this.props;

    fetchShoppingListsMetaData();
    fetchCohorts();
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
      createShoppingList,
      currentUser: { id }
    } = this.props;
    createShoppingList(title, description, id);
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
        <div className="dashboard__form">
          <CreationForm
            label="Create new cohort"
            onSubmit={this.handleCohortSubmission}
            type="menu"
            onHide={this.hideForms}
          />
        </div>
      )
    );
  };

  renderCreateListForm = () => {
    const { shoppingFormVisibility } = this.state;
    return (
      shoppingFormVisibility && (
        <div className="dashboard__form">
          <CreationForm
            label="Create new shopping list"
            onSubmit={this.handleShoppingListSubmission}
            type="menu"
            onHide={this.hideForms}
          />
        </div>
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
              name="Lists"
              items={shoppingLists}
              message="There are no lists yet!"
            />
            <GridList
              icon={<CohortIcon />}
              name="Cohorts"
              items={cohorts}
              message="There are no cohorts yet!"
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  cohorts: PropTypes.arrayOf(PropTypes.object),
  currentUser: UserPropType.isRequired,
  shoppingLists: PropTypes.objectOf(PropTypes.object),

  createCohort: PropTypes.func.isRequired,
  createShoppingList: PropTypes.func.isRequired,
  fetchCohorts: PropTypes.func.isRequired,
  fetchShoppingListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohorts: getCohorts(state),
  currentUser: getCurrentUser(state),
  shoppingLists: getShoppingLists(state)
});

export default connect(
  mapStateToProps,
  { createCohort, createShoppingList, fetchShoppingListsMetaData, fetchCohorts }
)(Dashboard);
