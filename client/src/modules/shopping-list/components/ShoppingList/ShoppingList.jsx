import React from 'react';
import PropTypes from 'prop-types';

import Auth from 'modules/legacy/Auth';

const ShoppingList = ({
  match: {
    params: { id }
  }
}) => (
  <div>
    <div style={{ padding: '100px' }}>{`Cohort of id: ${id}`}</div>
    <Auth />
  </div>
);

export default ShoppingList;

ShoppingList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};
