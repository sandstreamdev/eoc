import React from 'react';
import PropTypes from 'prop-types';

const ShoppingList = ({
  match: {
    params: { id }
  }
}) => <div>{`Shopping list of id: ${id}`}</div>;

ShoppingList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};

export default ShoppingList;
