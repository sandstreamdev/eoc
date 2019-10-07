import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { InfoIcon } from 'assets/images/icons';
import { MessageType } from 'common/constants/enums';
import './AlertBox.scss';

const AlertBox = ({ type, children }) => (
  <div
    className={classNames('alert-box', {
      'alert-box--success': type === MessageType.SUCCESS,
      'alert-box--warning': type === MessageType.ERROR,
      'alert-box--info': type === MessageType.INFO
    })}
  >
    <InfoIcon />
    {children}
  </div>
);

AlertBox.propTypes = {
  children: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired
};

export default AlertBox;
