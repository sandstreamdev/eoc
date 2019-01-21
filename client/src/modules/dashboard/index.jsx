import React from 'react';
import PropTypes from 'prop-types';

import ShoppingList from 'modules/shopping-list';

const Dashboard = ({
  match: {
    params: { id }
  }
}) => (
  <div>
    <ShoppingList />
  </div>
);

Dashboard.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};

export default Dashboard;
