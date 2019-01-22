import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ShoppingListIcon from 'assets/images/clipboard-list-solid';
import CohortIcon from 'assets/images/users-solid';
import { fetchAllLists } from './model/actions';
import { getCohorts, getShoppingLists } from './model/selectors';
import CardItem from './CardItem';

class Dashboard extends Component {
  componentDidMount() {
    const { fetchAllLists } = this.props;

    fetchAllLists();
  }

  render() {
    const { shoppingLists, cohortsList } = this.props;

    return (
      <div className="wrapper">
        <div className="dashboard">
          <h2 className="dashboard__heading">
            <ShoppingListIcon />
            Shopping lists
          </h2>
          <ul className="dashboard__list">
            {shoppingLists.map(list => (
              <li className="dashboard__list-item" key={list.id}>
                <CardItem name={list.name} />
              </li>
            ))}
          </ul>
          <h2 className="dashboard__heading">
            <CohortIcon />
            Cohorts
          </h2>
          <ul className="dashboard__list">
            {cohortsList.map(cohort => (
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
  cohortsList: PropTypes.arrayOf(PropTypes.object),
  shoppingLists: PropTypes.arrayOf(PropTypes.object),

  fetchAllLists: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohortsList: getCohorts(state),
  shoppingLists: getShoppingLists(state)
});

export default connect(
  mapStateToProps,
  { fetchAllLists }
)(Dashboard);
