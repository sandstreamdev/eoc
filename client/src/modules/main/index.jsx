import React from 'react';
import PropTypes from 'prop-types';

import Auth from 'modules/legacy/Auth';

const Main = ({
  match: {
    params: { id }
  }
}) => (
  <div>
    <div>Main aplication page</div>
    <Auth />
  </div>
);

export default Main;

Main.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};
