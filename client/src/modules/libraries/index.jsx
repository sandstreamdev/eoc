import React from 'react';
import { FormattedMessage } from 'react-intl';

import Library from './components/Library';
import data from './libraries.json';
import './Libraries.scss';

const libraries = JSON.parse(JSON.stringify(data));

const Libraries = () => (
  <div className="libraries wrapper">
    <h2 className="libraries__header">
      <FormattedMessage id="libraries.title" />
    </h2>
    <ul className="libraries__list">
      {Object.keys(libraries)
        .sort()
        .map(name => (
          <li className="libraries__item" key={name}>
            <Library name={name} data={libraries[name]} />
          </li>
        ))}
    </ul>
  </div>
);

export default Libraries;
