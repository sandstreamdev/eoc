import React from 'react';
import PropTypes from 'prop-types';

const Dashboard = ({
  match: {
    params: { id }
  }
}) => <div>Dashboard</div>;

export default Dashboard;

Dashboard.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};
