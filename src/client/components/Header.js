import React from 'react';

function Header(props) {
  return (
    <div className="app-header">
      <h1 className="app-header__logo">
        EOC&nbsp;
        <span className="app-header__subheader">APP</span>
      </h1>
      <a href="https://sandstream.pl/" className="app-header__link">
        www.sandstream.pl
      </a>
    </div>
  );
}

export default Header;
