import React from 'react';
import PropTypes from 'prop-types';

const Preloader = ({ message }) => (
  <div className="preloader">
    <div className="preloader__spinner">
      <div className="preloader__shape1" />
      <div className="preloader__shape2" />
    </div>
    <span className="preloader__text">{message}</span>
  </div>
);

Preloader.propTypes = {
  message: PropTypes.string
};

export default Preloader;
