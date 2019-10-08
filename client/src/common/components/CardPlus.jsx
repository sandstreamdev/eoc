import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { PlusIcon } from 'assets/images/icons';
import './CardPlus.scss';

const CardPlus = ({ label }) => (
  <div className="plus-card">
    <h3 className="plus-card__heading">
      <FormattedMessage id="common.card-plus.add" />
    </h3>
    <PlusIcon label={label} />
  </div>
);

CardPlus.propTypes = {
  label: PropTypes.string.isRequired
};

export default CardPlus;
