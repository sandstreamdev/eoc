import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { IntlPropType } from 'common/constants/propTypes';
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

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
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

  handleClickOutside = event => {
    const isClickedOutside = !this.textarea.current.contains(event.target);
    const { onClickOutside } = this.props;
    const { value } = this.state;
    const isDirty = value.length > 0;

    if (isClickedOutside && !isDirty) {
      onClickOutside();
    }
  };

  focusTextarea = () => this.textarea.current.focus();

  render() {
    const {
      disabled,
      intl: { formatMessage },
      placeholder
    } = this.props;
    const { value } = this.state;

    return (
      <div className="ss-textarea">
        <textarea
          className="ss-textarea__textarea"
          disabled={disabled}
          name={placeholder}
          onChange={this.handleOnChange}
          placeholder={formatMessage({ id: 'common.add-comment' })}
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
  intl: IntlPropType.isRequired,
  placeholder: PropTypes.string.isRequired,

  onChange: PropTypes.func,
  onClickOutside: PropTypes.func
};

export default injectIntl(Textarea);
