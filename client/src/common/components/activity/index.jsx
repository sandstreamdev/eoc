import React from 'react';

import { BellIcon } from 'assets/images/icons';
import Dropdown from 'common/components/Dropdown';
import ActivitiesList from './components/activitiesList';

const Activities = () => (
  <Dropdown
    buttonClassName="activities__button"
    buttonContent={<BellIcon />}
    dropdownClassName="activities__wrapper"
    dropdownName="activities"
  >
    <ActivitiesList />
  </Dropdown>
);

export default Activities;
