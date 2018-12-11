import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const MessageBox = ({ message, type }) => (
  <div
    className={classNames({
      'message-box': true,
      'message-box--green': type === 'success',
      'message-box--red': type === 'error',
      'message-box--gray': type === 'info'
    })}
  >
    <img
      src="src/client/assets/images/info-solid.svg"
      alt="Info icon"
      className="message-box__img"
    />
    <p className="message-box__content">{message}</p>
  </div>
);

MessageBox.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string
};

export default MessageBox;
