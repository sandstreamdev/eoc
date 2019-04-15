import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class TextInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEnlarged: false,
      value: ''
    };

    this.input = React.createRef();
  }

  handleOnChange = event => {
    const {
      target: { value }
    } = event;
    const { onChange } = this.props;

    this.setState({ value });
    if (onChange) {
      onChange(event);
    }
  };

  focusInput = () => this.input.current.focus();

  handleFocus = () => this.setState({ isEnlarged: true });

  handleBlur = () => {
    const { value } = this.state;

    if (value.length === 0) {
      this.setState({ isEnlarged: false });
    }
  };

  render() {
    const { placeholder } = this.props;
    const { isEnlarged, value } = this.state;
    return (
      <div className="ss-text-input">
        {placeholder && (
          <button
            className={classNames('ss-text-input__placeholder', {
              'ss-text-input__placeholder--is-focused': isEnlarged
            })}
            disabled={isEnlarged}
            onClick={this.focusInput}
            type="button"
          >
            {placeholder}
          </button>
        )}
        <input
          className="ss-text-input__input"
          name={placeholder}
          onBlur={this.handleBlur}
          onChange={this.handleOnChange}
          onFocus={this.handleFocus}
          placeholder={placeholder}
          ref={this.input}
          type="text"
          value={value}
        />
      </div>
    );
  }
}

TextInput.propTypes = {
  placeholder: PropTypes.string,

  onChange: PropTypes.func
};

export default TextInput;
