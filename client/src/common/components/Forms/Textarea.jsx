import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Textarea extends PureComponent {
  constructor(props) {
    super(props);

    const { initialValue } = this.props;
    const descriptionExist = initialValue && initialValue.length > 0;

    this.state = { isEnlarged: descriptionExist, value: initialValue || '' };
    this.textarea = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
    document.addEventListener('keypress', this.handleEnterPress);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('keypress', this.handleEnterPress);
  }

  handleClick = event => {
    const { target } = event;
    const { value } = this.state;

    if (!this.textarea.current.contains(target) && value.length > 0) {
      this.handleDataSave();
    }
  };

  handleEnterPress = event => {
    const { code } = event;

    if (code === 'Enter') {
      this.handleDataSave();
    }
  };

  handleDataSave = () => {
    const { onSave } = this.props;
    const { value } = this.state;

    onSave(value);
  };

  handleOnChange = event => {
    const {
      target: { value }
    } = event;
    const { onChange } = this.props;

    this.setState({ value });
    onChange && onChange(value);
  };

  focusTextarea = () => this.textarea.current.focus();

  handleFocus = () => this.setState({ isEnlarged: true });

  handleBlur = () => {
    const { value } = this.state;
    value.length <= 0 && this.setState({ isEnlarged: false });
  };

  render() {
    const { placeholder } = this.props;
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
  initialValue: PropTypes.string,
  placeholder: PropTypes.string.isRequired,

  onChange: PropTypes.func,
  onSave: PropTypes.func
};

export default Textarea;
