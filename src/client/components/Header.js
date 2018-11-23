import React from 'react';

function Header(props) {
  return (
    <div className="app-header">
      <div className="app-header__logo">
        <span className="app-header__text">EOC</span>

        <img
          className="app-header__icon"
          src="src/client/assets/images/coffee-solid.svg"
          alt="Cofee icon"
        />
      </div>

      <a href="https://sandstream.pl/" className="app-header__link">
        www.sandstream.pl
      </a>
    </div>
  );
}

export default Header;
