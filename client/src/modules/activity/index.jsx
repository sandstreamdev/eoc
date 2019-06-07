import React, { PureComponent } from 'react';

import { BellIcon } from 'assets/images/icons';
import Dropdown from 'common/components/Dropdown';

class Activities extends PureComponent {
  render() {
    return (
      <Dropdown
        buttonClassName="activities__button"
        buttonContent={<BellIcon />}
        dropdownClassName="activities__wrapper"
        dropdownName="activities"
      >
        <ul className="activities__menu">
          <li className="activities__menu-item">My cohorts</li>
          <li className="activities__menu-item">Logout</li>
        </ul>
      </Dropdown>
    );
  }
}

Activities.propTypes = {};

export default Activities;
