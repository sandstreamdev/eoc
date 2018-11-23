import React from 'react';

function SearchBar() {
  return (
    <div className="search-bar">
      <form className="search-bar__form">
        <input
          className="search-bar__input"
          type="text"
          placeholder="Czego brakuje?"
        />
        <input className="search-bar__submit" type="submit" />
      </form>
    </div>
  );
}

export default SearchBar;
