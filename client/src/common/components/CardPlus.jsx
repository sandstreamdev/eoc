import React from 'react';
import { FormattedMessage } from 'react-intl';

import { PlusIcon } from 'assets/images/icons';

const CardPlus = () => (
  <div className="plus-card">
    <h3 className="plus-card__heading">
      <FormattedMessage id="common.card-plus.add" />
    </h3>
    <PlusIcon />
  </div>
);

export default CardPlus;
