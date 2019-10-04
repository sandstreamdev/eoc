import React from 'react';
import PropTypes from 'prop-types';

import CohortName from './CohortName';
import CohortDescription from './CohortDescription';
import './CohortHeader.scss';

const CohortHeader = ({ details, updateBreadcrumbs }) => (
  <header className="cohort-header">
    <CohortName details={details} onNameChange={updateBreadcrumbs} />
    <CohortDescription details={details} />
  </header>
);

CohortHeader.propTypes = {
  details: PropTypes.objectOf(PropTypes.any).isRequired,

  updateBreadcrumbs: PropTypes.func.isRequired
};

export default CohortHeader;
