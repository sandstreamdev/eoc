import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MessageType } from 'common/constants/enums';
import { MessagePropType } from 'common/constants/propTypes';
import { InfoIcon } from 'assets/images/icons';

const MessageBox = ({ message, type, children }) => (
  <div
    className={classNames('message-box', {
      'message-box--green': type === MessageType.SUCCESS,
      'message-box--red':
        type === MessageType.ERROR || type === MessageType.ERROR_NO_RETRY,
      'message-box--gray': type === MessageType.INFO
    })}
  >
    <span className="message-box__icon">
      <InfoIcon />
    </span>
    <p className="message-box__content">{message || children}</p>
  </div>
);

MessageBox.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string,
  type: MessagePropType.isRequired
};

export default MessageBox;
