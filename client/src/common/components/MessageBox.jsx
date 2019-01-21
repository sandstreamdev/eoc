import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MessageType } from 'common/constants/enums';
import { MessagePropType } from '../constants/propTypes';

const MessageBox = ({ message, type }) => (
  <div
    className={classNames('message-box', {
      'message-box--green': type === MessageType.SUCCESS,
      'message-box--red': type === MessageType.ERROR,
      'message-box--gray': type === MessageType.INFO
    })}
  >
    <img
      alt="Info icon"
      className="message-box__img"
      src="client/assets/images/info-solid.svg"
    />
    <p className="message-box__content">{message}</p>
  </div>
);

MessageBox.propTypes = {
  message: PropTypes.string,
  type: MessagePropType.isRequired
};

export default MessageBox;
