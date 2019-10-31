import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Textarea.scss';

class Textarea extends PureComponent {
  constructor(props) {
    super(props);

    const { initialValue } = this.props;

    this.state = {
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

  render() {
    const { disabled, placeholder } = this.props;
    const { value } = this.state;

    return (
      <div className="ss-textarea">
        <textarea
          className="ss-textarea__textarea"
          disabled={disabled}
          name={placeholder}
          onChange={this.handleOnChange}
          placeholder="Add comment"
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

  onChange: PropTypes.func
};

export default Textarea;
