import React from 'react';
import { isURL } from 'validator';
import { FormattedMessage } from 'react-intl';

import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import { licensePropType } from 'common/constants/propTypes';
import './LicenseDetails.scss';

const prepareLicenseType = licenseType =>
  typeof licenseType === 'string' ? licenseType : licenseType.join(', ');

const LicenseDetails = ({ license }) => {
  if (license) {
    const { licenseText, licenseType, licenseUrl, repository } = license;
    const displayLicense = licenseText || (licenseUrl && isURL(licenseUrl));
    const displayRepository = repository && isURL(repository);

    return (
      <div className="license-details">
        {displayRepository && (
          <div className="license-details__content">
            <h4 className="license-details__heading">
              <FormattedMessage id="libraries.repository" />
              <span> </span>
            </h4>
            <a
              className="license-details__link"
              href={repository}
              rel="noopener noreferrer"
              target="_blank"
            >
              {repository}
            </a>
          </div>
        )}
        {displayLicense && (
          <div className="license-details__content">
            <h4 className="license-details__heading">
              <FormattedMessage id="libraries.license" />
              <span> </span>
            </h4>
            {licenseText ? (
              <pre>{licenseText}</pre>
            ) : (
              <a
                className="license-details__link"
                href={licenseUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {prepareLicenseType(licenseType)}
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <MessageBox type={MessageType.INFO}>
      <FormattedMessage id="libraries.no-license" />
    </MessageBox>
  );
};

LicenseDetails.propTypes = {
  license: licensePropType
};

export default LicenseDetails;
