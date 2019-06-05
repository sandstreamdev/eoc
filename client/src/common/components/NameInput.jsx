import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
    const { disabled, name, onNameChange } = this.props;
    return (
      <div className="name-input">
        <input
          className="name-input__input primary-input"
          disabled={disabled}
          name="name"
          onChange={onNameChange}
          ref={this.nameInput}
          type="text"
          value={name}
          required
        />
        <input
          className={classNames('name-input__submit primary-button', {
            'name-input__submit--disabled': disabled
          })}
          disabled={disabled}
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
  onKeyPress: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired
};

export default NameInput;
