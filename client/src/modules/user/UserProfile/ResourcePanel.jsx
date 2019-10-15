import React from 'react';
import { injectIntl } from 'react-intl';

import {
  IntlPropType,
  ResourcesDataPropType
} from 'common/constants/propTypes';
import ErrorMessage from 'common/components/Forms/ErrorMessage';
import { Routes } from 'common/constants/enums';
import ResourceLinks from './ResourceLinks';
import './ResourcePanel.scss';

const ResourcePanel = ({
  resources: { cohorts, lists },
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
  const separator = cohortContext && listContext ? '/' : '';
  const headerContext = `${cohortContext}${separator}${listContext}`;
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
  resources: ResourcesDataPropType.isRequired,
  intl: IntlPropType.isRequired
};

export default injectIntl(ResourcePanel);
