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
  const listContext = formatMessage(
    { id: 'list.label-plural' },
    { total: lists.length }
  );
  const cohortContext = formatMessage(
    { id: 'cohort.label-plural' },
    { total: cohorts.length }
  );
  const headerContext = `${cohorts.length > 0 ? cohortContext : ''}${
    lists.length > 0 && cohorts.length > 0 ? '/' : ''
  }${lists.length > 0 ? listContext : ''}`;
  const getMessage = context =>
    formatMessage(
      { id: 'user.delete-account-make-someone-else-an-owner' },
      { context }
    );

  return (
    <div className="resource-panel">
      <h3 className="resource-panel__header">
        <ErrorMessage
          message={formatMessage(
            {
              id: 'user.delete-account-make-someone-else-an-owner-header'
            },
            { context: headerContext }
          )}
        />
      </h3>
      {cohorts.length > 0 && (
        <ResourceLinks
          message={getMessage(cohortContext)}
          resources={cohorts}
          route={Routes.COHORT}
        />
      )}
      {lists.length > 0 && (
        <ResourceLinks
          message={getMessage(listContext)}
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
