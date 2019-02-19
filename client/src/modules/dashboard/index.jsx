import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _map from 'lodash/map';

import Toolbar from 'common/components/Toolbar';
import ToolbarItem from 'common/components/Toolbar/components/ToolbarItem';
import { CohortIcon, ListIcon } from 'assets/images/icons';
import PlusIcon from 'assets/images/plus-solid.svg';
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
import CardItem from './CardItem';

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
        </Toolbar>
        <div className="wrapper">
          <div className="dashboard">
            <h2 className="dashboard__heading">
              <ListIcon />
              Lists
            </h2>
            <ul className="dashboard__list">
              {_map(shoppingLists, item => (
                <li className="dashboard__list-item" key={item._id}>
                  <Link to={`list/${item._id}`}>
                    <CardItem name={item.name} />
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="dashboard__heading">
              <CohortIcon />
              Cohorts
            </h2>
            <ul className="dashboard__list">
              {cohorts.map(cohort => (
                <li className="dashboard__list-item" key={cohort._id}>
                  <CardItem name={cohort.name} />
                </li>
              ))}
            </ul>
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
