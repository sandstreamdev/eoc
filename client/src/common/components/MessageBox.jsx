import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MessageType } from 'common/constants/enums';
import { MessagePropType } from 'common/constants/propTypes';
import { InfoIcon } from 'assets/images/icons';

const MessageBox = ({ message, type }) => (
  <div
    className={classNames('message-box', {
      'message-box--green': type === MessageType.SUCCESS,
      'message-box--red':
        type === (MessageType.ERROR || MessageType.ERROR_NO_RETRY),
      'message-box--gray': type === MessageType.INFO
    })}
  >
    <span>
      <InfoIcon />
    </span>
    <p className="message-box__content">{message}</p>
  </div>
);

MessageBox.propTypes = {
  message: PropTypes.string,
  type: MessagePropType.isRequired
};

export default MessageBox;
