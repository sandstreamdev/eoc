import React from 'react';

const SearchBar = () => (
  <div className="search-bar">
    <form className="search-bar__form">
      <input
        className="search-bar__input"
        type="text"
        placeholder="What is missing?"
      />
      <input className="search-bar__submit" type="submit" />
    </form>
  </div>
);

export default SearchBar;
