import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { messageType } from '../common/enums';

const MessageBox = ({ message, type }) => (
  <div
    className={classNames('message-box', {
      'message-box--green': type === messageType.SUCCESS,
      'message-box--red': type === messageType.ERROR,
      'message-box--gray': type === messageType.INFO
    })}
  >
    <img
      alt="Info icon"
      className="message-box__img"
      src="src/client/assets/images/info-solid.svg"
    />
    <p className="message-box__content">{message}</p>
  </div>
);

MessageBox.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error', 'info'])
};

export default MessageBox;
