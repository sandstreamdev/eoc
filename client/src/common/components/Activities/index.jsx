import React from 'react';
import { injectIntl } from 'react-intl';

import { ActivitiesIcon } from 'assets/images/icons';
import Dropdown from 'common/components/Dropdown';
import ActivitiesList from './components/ActivitiesList';
import { IntlPropType } from 'common/constants/propTypes';
import './Activities.scss';

const Activities = ({ intl: { formatMessage } }) => (
  <Dropdown
    buttonClassName="activities__button"
    buttonContent={<ActivitiesIcon />}
    dropdownClassName="activities__wrapper"
    dropdownName={formatMessage({
      id: 'activity.title'
    })}
  >
    <ActivitiesList />
  </Dropdown>
);

Activities.propTypes = {
  intl: IntlPropType.isRequired
};

export default injectIntl(Activities);
