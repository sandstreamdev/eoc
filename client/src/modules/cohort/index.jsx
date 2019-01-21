import React from 'react';
import PropTypes from 'prop-types';

const Cohort = ({
  match: {
    params: { id }
  }
}) => <div>{`Cohort of id: ${id}`}</div>;

Cohort.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};

export default Cohort;
