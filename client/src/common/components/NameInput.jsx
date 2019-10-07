import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@sandstreamdev/std/web';

import './NameInput.scss';

class NameInput extends PureComponent {
  constructor(props) {
    super(props);

    this.nameInput = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress);
    document.addEventListener('mousedown', this.onClick);

    this.nameInput.current.focus();
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;

    onUnmount();
    document.removeEventListener('keydown', this.onKeyPress);
    document.removeEventListener('mousedown', this.onClick);
  }

  onClick = event => {
    const { onClick } = this.props;
    const isClickedOutside = !this.nameInput.current.contains(event.target);

    onClick(event, isClickedOutside);
  };

  onKeyPress = event => {
    const { onKeyPress } = this.props;

    onKeyPress(event);
  };

  render() {
    const { disabled, name, onNameChange, onFocus } = this.props;

    return (
      <div className="name-input">
        <input
          className="name-input__input primary-input"
          disabled={disabled}
          name="name"
          onChange={onNameChange}
          onFocus={onFocus}
          ref={this.nameInput}
          required
          type="text"
          value={name}
        />
        <input
          className={classNames('name-input__submit primary-button', {
            'name-input__submit--disabled': disabled
          })}
          disabled={disabled || !name}
          type="submit"
          value="save"
        />
      </div>
    );
  }
}

NameInput.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,

  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired
};

export default NameInput;
