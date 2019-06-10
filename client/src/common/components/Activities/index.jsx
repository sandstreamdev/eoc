import React from 'react';

import { ActivitiesIcon } from 'assets/images/icons';
import Dropdown from 'common/components/Dropdown';
import ActivitiesList from './components/ActivitiesList';

const Activities = () => (
  <Dropdown
    buttonClassName="activities__button"
    buttonContent={<ActivitiesIcon />}
    dropdownClassName="activities__wrapper"
    dropdownName="activities"
  >
    <ActivitiesList />
  </Dropdown>
);

export default Activities;
