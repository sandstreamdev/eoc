import React from 'react';
import PropTypes from 'prop-types';

const ShoppingList = ({
  match: {
    params: { id }
  }
}) => <div style={{ padding: '100px' }}>{`Cohort of id: ${id}`}</div>;

export default ShoppingList;

ShoppingList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};
