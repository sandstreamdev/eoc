import React from 'react';

const FilterBox = () => (
  <div className="filter-box">
    <span className="filter-box__label">Filter by:</span>
    <select className="filter-box__select" onChange={console.log('Filtering')}>
      <option value="filterbyall">Filter by all</option>
      <option value="filterbymine">Filter by mine</option>
    </select>
  </div>
);

export default FilterBox;
