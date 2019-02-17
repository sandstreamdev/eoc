import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _map from 'lodash/map';

import {
  ClipboardSolid as ShoppingListIcon,
  UsersSolid as CohortIcon
} from 'assets/images/icons';
import { fetchShoppingListsMetaData } from 'modules/shopping-list/model/actions';
import { fetchCohorts } from 'modules/cohort/model/actions';
import { getShoppingLists } from 'modules/shopping-list/model/selectors';
import { getCohorts } from 'modules/cohort/model/selectors';
import CardItem from './CardItem';
import Toolbar from 'app/components/Toolbar/Toolbar';
import PlusIcon from 'assets/images/plus-solid.svg';

class Dashboard extends Component {
  componentDidMount() {
    const { fetchShoppingListsMetaData, fetchCohorts } = this.props;

    fetchShoppingListsMetaData();
    fetchCohorts();
  }

  get menuItems() {
    return [
      {
        label: 'Create new list',
        mainIcon: 'cohort',
        onClick: this.showCreateForm,
        supplementIconSrc: PlusIcon
      },
      {
        label: 'Create ne cohort',
        mainIcon: 'list',
        onClick: this.showCreateForm,
        supplementIconSrc: PlusIcon
      }
    ];
  }

  showCreateForm = () => {};

  render() {
    const { shoppingLists, cohorts } = this.props;

    return (
      <Fragment>
        <Toolbar isHomePage menuItems={this.menuItems} />
        <div className="wrapper">
          <div className="dashboard">
            <h2 className="dashboard__heading">
              <ShoppingListIcon />
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
  shoppingLists: PropTypes.objectOf(PropTypes.object),

  fetchCohorts: PropTypes.func.isRequired,
  fetchShoppingListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohorts: getCohorts(state),
  shoppingLists: getShoppingLists(state)
});

export default connect(
  mapStateToProps,
  { fetchShoppingListsMetaData, fetchCohorts }
)(Dashboard);
