import React from 'react';

const SortBox = () => (
  <div className="sort-box">
    <span className="sort-box__desc">Sort by:</span>
    <select className="sort-box__select">
      <option value="author">Author</option>
      <option value="date">Date</option>
      <option value="name">Name</option>
    </select>
    <div className="sort-box__controllers">
      <button className="sort-box__arrow" type="button">
        top
      </button>
      <button className="sort-box__arrow" type="button">
        bottom
      </button>
    </div>
  </div>
);

export default SortBox;
