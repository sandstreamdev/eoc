import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { IntlPropType } from 'common/constants/propTypes';
import ErrorMessage from 'common/components/Forms/ErrorMessage';
import { Routes } from 'common/constants/enums';
import ResourceLinks from './ResourceLinks';
import './ResourcePanel.scss';

const ResourcePanel = ({
  errorData: { cohorts, lists },
  intl: { formatMessage }
}) => {
  const getMessage = (contextId, total) =>
    formatMessage(
      { id: 'user.delete-account-make-someone-else-an-owner' },
      { context: formatMessage({ id: contextId }, { total }) }
    );

  return (
    <div className="resource-panel">
      <h3 className="resource-panel__header">
        <ErrorMessage
          message={formatMessage({
            id: 'user.delete-account-make-someone-else-an-owner-header'
          })}
        />
      </h3>
      {cohorts.length > 0 && (
        <ResourceLinks
          message={getMessage('cohort.label-plural', cohorts.length)}
          resources={cohorts}
          route={Routes.COHORT}
        />
      )}
      {lists.length > 0 && (
        <ResourceLinks
          message={getMessage('list.label-plural', lists.length)}
          resources={lists}
          route={Routes.LIST}
        />
      )}
    </div>
  );
};

ResourcePanel.propTypes = {
  errorData: PropTypes.shape({
    cohorts: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ),
    lists: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  intl: IntlPropType.isRequired
};

export default injectIntl(ResourcePanel);
