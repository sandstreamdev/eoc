import React from 'react';
import PropTypes from 'prop-types';

const Main = ({
  match: {
    params: { id }
  }
}) => <div>Main aplication page</div>;

export default Main;

Main.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};
