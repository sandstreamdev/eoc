import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { isURL } from 'validator';

import { licensePropType } from 'common/constants/propTypes';
import './License.scss';

const prepareLicenseType = licenseType =>
  typeof licenseType === 'string' ? licenseType : licenseType.join(', ');

const License = ({
  isVisible,
  license: { licenseText, licenses: licenseType, licenseUrl }
}) => {
  const displayLicenseUrl = !licenseText && licenseUrl && isURL(licenseUrl);

  return (
    <CSSTransition
      classNames="license-expand"
      in={isVisible}
      mountOnEnter
      timeout={200}
      unmountOnExit
    >
      <div className="license">
        {licenseText && <pre>{licenseText}</pre>}
        {displayLicenseUrl && (
          <a className="license__link" href={licenseUrl}>
            {prepareLicenseType(licenseType)}
          </a>
        )}
      </div>
    </CSSTransition>
  );
};

License.propTypes = {
  isVisible: PropTypes.bool,
  license: licensePropType
};

export default License;
