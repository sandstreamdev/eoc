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
import { getCohorts, getCohortsError } from 'modules/cohort/model/selectors';
import { MessageType } from 'common/constants/enums';
import CardItem from './CardItem';
import MessageBox from 'common/components/MessageBox';
// import { getData } from 'common/utils/fetchMethods';

// class Http extends Component {
//   state = {
//     query: undefined,
//     busy: false,
//     error: undefined,
//     data: undefined
//   }

//   fetch = (...query) => {
//     const [url, ...params] = query;

//     const action = () => getData(url);

//     this.setState({ query, busy: true }, () => {
//       action()
//         .then(resp => resp.json())
//         .then(data => this.setState({ data }))
//         .catch(error => this.setState({ error }))
//         .then(() => this.setState({ busy: false }))
//     });
//   }

//   render()
//   {

//     return this.props.children({ fetch: this.fetch, ...this.state });
//   }
// }

class Dashboard extends Component {
  componentDidMount() {
    const { fetchShoppingLists, fetchCohorts } = this.props;

    fetchShoppingLists();
    fetchCohorts();
  }

  render() {
    const { shoppingLists, cohorts, cohortsError } = this.props;

    return (
      // <Http>
      //   {({ fetch, data, busy, error }) => (
      <div className="wrapper">
        <div className="dashboard">
          {/* <div>Data: {JSON.stringify(data, null, 2)}</div>
          <div>Busy: {busy ? 'busy' : 'not busy'}</div>
          <div>Error: {error}</div>
          <button onClick={() => fetch('http://localhost:8080/cohorts')}>Fetch data</button> */}
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
          {cohortsError && (
            <MessageBox message={cohortsError} type={MessageType.ERROR} />
          )}
          <ul className="dashboard__list">
            {cohorts.map(cohort => (
              <li className="dashboard__list-item" key={cohort._id}>
                <CardItem name={cohort.name} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      //   )}
      // </Http>
    );
  }
}

Dashboard.propTypes = {
  cohorts: PropTypes.arrayOf(PropTypes.object),
  shoppingLists: PropTypes.arrayOf(PropTypes.object),
  cohortsError: PropTypes.string,

  fetchCohorts: PropTypes.func.isRequired,
  fetchShoppingLists: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohorts: getCohorts(state),
  cohortsError: getCohortsError(state),
  shoppingLists: getShoppingLists(state)
});

export default connect(
  mapStateToProps,
  { fetchShoppingLists, fetchCohorts }
)(Dashboard);
