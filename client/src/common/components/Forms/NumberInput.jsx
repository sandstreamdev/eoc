import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class NumberInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEnlarged: false,
      value: ''
    };

    this.input = React.createRef();
  }

  componentDidUpdate() {
    const { value } = this.state;

    value.length > 0 && this.keepPlaceholderEnlarged();
  }

  keepPlaceholderEnlarged = () => this.setState({ isEnlarged: true });

  handleOnChange = event => {
    const {
      target: { value }
    } = event;
    const { onChange } = this.props;

    this.setState({ value });
    onChange(event);
  };

  focusInput = () => this.input.current.focus();

  handleFocus = () => this.setState({ isEnlarged: true });

  handleBlur = () => this.setState({ isEnlarged: false });

  render() {
    const { placeholder } = this.props;
    const { isEnlarged, value } = this.state;
    return (
      <div className="ss-number-input">
        {placeholder && (
          <button
            className={classNames('ss-number-input__placeholder', {
              'ss-number-input__placeholder--is-focused': isEnlarged
            })}
            disabled={isEnlarged}
            onClick={this.focusInput}
            type="button"
          >
            {placeholder}
          </button>
        )}
        <input
          className="ss-number-input__input"
          max="10000"
          min="0"
          name="number"
          onBlur={this.handleBlur}
          onChange={this.handleOnChange}
          onFocus={this.handleFocus}
          placeholder={placeholder}
          ref={this.input}
          step="1"
          type="number"
          value={value}
        />
      </div>
    );
  }
}

NumberInput.propTypes = {
  placeholder: PropTypes.string,

  onChange: PropTypes.func
};

export default NumberInput;
