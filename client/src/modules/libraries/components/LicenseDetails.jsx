import React from 'react';
import isURL from 'validator/lib/isURL';
import { FormattedMessage } from 'react-intl';

import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import { licensePropType } from 'common/constants/propTypes';
import './LicenseDetails.scss';

const LicenseDetails = ({ license }) => {
  if (!license) {
    return (
      <MessageBox type={MessageType.INFO}>
        <FormattedMessage id="libraries.no-license" />
      </MessageBox>
    );
  }

  const { text, type, repository, url } = license;
  const isLicenseVisible = text || (url && isURL(url));
  const isRepositoryVisible = repository && isURL(repository);
  const licenseType = typeof type === 'string' ? type : type.join(', ');

  return (
    <div className="license-details">
      {isRepositoryVisible && (
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
      {isLicenseVisible && (
        <div className="license-details__content">
          <h4 className="license-details__heading">
            <FormattedMessage id="libraries.license" />
            <span> </span>
          </h4>
          {text ? (
            <pre>{text}</pre>
          ) : (
            <a
              className="license-details__link"
              href={url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {licenseType}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

LicenseDetails.propTypes = {
  license: licensePropType
};

export default LicenseDetails;
