import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  ClipboardSolid as ShoppingListIcon,
  UsersSolid as CohortIcon
} from 'assets/images/icons';
import { fetchShoppingLists } from 'modules/shopping-list/model/actions';
import { fetchCohorts } from 'modules/cohort/model/actions';
import { getShoppingLists } from 'modules/shopping-list/model/selectors';
import { getCohorts } from 'modules/cohort/model/selectors';
import CardItem from './CardItem';

class Dashboard extends Component {
  componentDidMount() {
    const { fetchShoppingLists, fetchCohorts } = this.props;

    fetchShoppingLists();
    fetchCohorts();
  }

  render() {
    const { shoppingLists, cohorts } = this.props;

    return (
      <div className="wrapper">
        <div className="dashboard">
          <h2 className="dashboard__heading">
            <ShoppingListIcon />
            Shopping lists
          </h2>
          <ul className="dashboard__list">
            {shoppingLists.map(list => (
              <li className="dashboard__list-item" key={list._id}>
                <CardItem name={list.name} />
              </li>
            ))}
          </ul>
          <h2 className="dashboard__heading">
            <CohortIcon />
            Cohorts
          </h2>
          <ul className="dashboard__list">
            {cohorts.map(cohort => (
              <li className="dashboard__list-item" key={cohort.id}>
                <CardItem name={cohort.name} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  cohorts: PropTypes.arrayOf(PropTypes.object),
  shoppingLists: PropTypes.arrayOf(PropTypes.object),

  fetchCohorts: PropTypes.func.isRequired,
  fetchShoppingLists: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohorts: getCohorts(state),
  shoppingLists: getShoppingLists(state)
});

export default connect(
  mapStateToProps,
  { fetchShoppingLists, fetchCohorts }
)(Dashboard);
