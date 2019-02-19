import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _map from 'lodash/map';
import classNames from 'classnames';

import { SvgIcon } from 'assets/images/icons';
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
import Toolbar from 'common/components/Toolbar/Toolbar';
import { UserPropType } from 'common/constants/propTypes';
import ToolbarItem from 'common/components/Toolbar/components/ToolbarItem/ToolbarItem';
import CardItem from './CardItem';
import { IconType } from 'common/constants/enums';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.cohortFormRef = React.createRef();
    this.listFormRef = React.createRef();
  }

  state = {
    cohortFormVisibility: false,
    shoppingFormVisibility: false
  };

  componentDidMount() {
    const { fetchShoppingListsMetaData, fetchCohorts } = this.props;

    fetchShoppingListsMetaData();
    fetchCohorts();
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  addEventListeners = () => {
    document.addEventListener('click', this.clickListener, true);
    document.addEventListener('keydown', this.escapeListener);
  };

  removeEventListeners = () => {
    document.removeEventListener('click', this.clickListener, true);
    document.removeEventListener('keydown', this.escapeListener);
  };

  clickListener = e => {
    const {
      listFormRef: { current: listForm },
      cohortFormRef: { current: cohortForm }
    } = this;
    if (!listForm.contains(e.target) && !cohortForm.contains(e.target)) {
      this.hideForms();
    }
  };

  escapeListener = event => {
    event.code === 'Escape' ? this.hideForms() : null;
  };

  hideForms = () => {
    this.setState({
      cohortFormVisibility: false,
      shoppingFormVisibility: false
    });
    this.removeEventListeners();
  };

  showListForm = () => {
    this.setState({
      shoppingFormVisibility: true
    });
    this.addEventListeners();
  };

  showCohortForm = () => {
    this.setState({
      cohortFormVisibility: true
    });
    this.addEventListeners();
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

  renderCreateCohortOption = () => {
    const { cohortFormVisibility } = this.state;
    return (
      <div
        className={classNames('dashboard__form', {
          hidden: !cohortFormVisibility
        })}
        ref={this.cohortFormRef}
      >
        {cohortFormVisibility && (
          <CreationForm
            label="Create new cohort"
            onSubmit={this.handleCohortSubmission}
            type="menu"
          />
        )}
      </div>
    );
  };

  renderCreateListForm = () => {
    const { shoppingFormVisibility } = this.state;
    return (
      <div
        className={classNames('dashboard__form', {
          hidden: !shoppingFormVisibility
        })}
        ref={this.listFormRef}
      >
        {shoppingFormVisibility && (
          <CreationForm
            label="Create new shopping list"
            onSubmit={this.handleShoppingListSubmission}
            type="menu"
          />
        )}
      </div>
    );
  };

  render() {
    const { shoppingLists, cohorts } = this.props;

    return (
      <Fragment>
        <Toolbar isHomePage>
          <ToolbarItem
            mainIcon={IconType.COHORT}
            onClick={this.showCohortForm}
            supplementIconSrc={PlusIcon}
          >
            {this.renderCreateCohortOption()}
          </ToolbarItem>
          <ToolbarItem
            mainIcon={IconType.LIST}
            onClick={this.showListForm}
            supplementIconSrc={PlusIcon}
          >
            {this.renderCreateListForm()}
          </ToolbarItem>
        </Toolbar>
        <div className="wrapper">
          <div className="dashboard">
            <h2 className="dashboard__heading">
              <SvgIcon icon={IconType.LIST} />
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
              <SvgIcon icon={IconType.COHORT} />
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
