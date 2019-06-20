import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Textarea extends PureComponent {
  constructor(props) {
    super(props);

    const { initialValue } = this.props;

    this.state = {
      isEnlarged: initialValue && initialValue.length > 0,
      value: initialValue || ''
    };
    this.textarea = React.createRef();
  }

  handleOnChange = event => {
    const {
      target: { value }
    } = event;
    const { onChange } = this.props;

    this.setState({ value });
    if (onChange) {
      onChange(value);
    }
  };

  focusTextarea = () => this.textarea.current.focus();

  handleFocus = () => {
    const { onFocus } = this.props;

    onFocus();
    this.setState({ isEnlarged: true });
  };

  handleBlur = () => {
    const { value } = this.state;
    const { onBlur } = this.props;

    onBlur();
    if (value.length === 0) {
      this.setState({ isEnlarged: false });
    }
  };

  render() {
    const { disabled, placeholder } = this.props;
    const { isEnlarged, value } = this.state;

    return (
      <div className="ss-textarea">
        {placeholder && (
          <button
            className={classNames('ss-textarea__placeholder', {
              'ss-textarea__placeholder--is-focused': isEnlarged
            })}
            disabled={isEnlarged}
            onClick={this.focusTextarea}
            type="button"
          >
            {placeholder}
          </button>
        )}
        <textarea
          className="ss-textarea__textarea"
          disabled={disabled}
          name={placeholder}
          onBlur={this.handleBlur}
          onChange={this.handleOnChange}
          onFocus={this.handleFocus}
          placeholder={placeholder}
          ref={this.textarea}
          value={value}
        />
      </div>
    );
  }
}

Textarea.propTypes = {
  disabled: PropTypes.bool,
  initialValue: PropTypes.string,
  placeholder: PropTypes.string.isRequired,

  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func
};

export default Textarea;
