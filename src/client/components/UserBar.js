import React from 'react';

import { PLACEHOLDER_URL } from '../common/variables';

const UserBar = () => (
  <div className="user-bar">
    <div className="user-bar__wrapper">
      <img
        alt="User avatar"
        className="user-bar__avatar"
        src={PLACEHOLDER_URL}
      />

      <span className="user-bar__user-data">Jason Statham</span>

      <a href="http://localhost:8080/logout" className="user-bar__logout">
        <img
          alt="Log out"
          className="user-bar__icon"
          src="src/client/assets/images/sign-out.svg"
        />
      </a>
    </div>
  </div>
);

export default UserBar;
