import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './ResourceLinks.scss';

const ResourceLinks = ({ message, resources, route }) => (
  <div className="resource-links">
    <h4 className="resource-links__header">{message}</h4>
    <ul className="resource-links__list">
      {resources.map(resource => (
        <li className="resource-links__link-wrapper" key={resource._id}>
          <Link
            className="resource-links__link"
            target="_blank"
            to={`/${route}/${resource._id}`}
          >
            {resource.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

ResourceLinks.propTypes = {
  message: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  route: PropTypes.string.isRequired
};

export default ResourceLinks;
