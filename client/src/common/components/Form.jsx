import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import { ListType } from 'modules/list/consts';
import { IntlPropType } from 'common/constants/propTypes';

class Form extends PureComponent {
  constructor(props) {
    super(props);
    const { defaultDescription, defaultName } = this.props;

    this.state = {
      description: defaultDescription || '',
      name: defaultName || ''
    };

    this.input = React.createRef();
  }

  componentDidMount() {
    this.input.current.focus();
  }

  handleNameChange = event => {
    const {
      target: { value }
    } = event;
    const { onNameChange } = this.props;

    this.setState({ name: value });
    onNameChange(value);
  };

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;
    const { onDescriptionChange } = this.props;

    this.setState({ description: value });
    onDescriptionChange(value);
  };

  handleSubmit = event => event.preventDefault();

  handleSelect = event => {
    const { onSelect } = this.props;
    const {
      target: { value }
    } = event;

    onSelect(value);
  };

  render() {
    const { description, name } = this.state;
    const {
      disabled,
      errorMessageId,
      intl: { formatMessage },
      onSelect
    } = this.props;

    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <label className="form__label">
          <input
            className="form__input primary-input"
            disabled={disabled}
            name="name"
            onChange={this.handleNameChange}
            placeholder={formatMessage({ id: 'common.form.name' })}
            ref={this.input}
            type="text"
            value={name}
          />
          {errorMessageId && (
            <span className="error-message">
              <FormattedMessage id="common.form.default-warning" />
            </span>
          )}
        </label>
        <label className="form__label">
          <textarea
            className="form__textarea primary-textarea"
            disabled={disabled}
            name="description"
            onChange={this.handleDescriptionChange}
            placeholder={formatMessage({ id: 'common.form.description' })}
            type="text"
            value={description}
          />
        </label>
        {onSelect && (
          <select
            className="form__select primary-select"
            disabled={disabled}
            onChange={this.handleSelect}
          >
            <option value={ListType.LIMITED}>{ListType.LIMITED}</option>
            <option value={ListType.SHARED}>{ListType.SHARED}</option>
          </select>
        )}
      </form>
    );
  }
}

Form.propTypes = {
  defaultDescription: PropTypes.string,
  defaultName: PropTypes.string,
  disabled: PropTypes.bool,
  errorMessageId: PropTypes.string,
  intl: IntlPropType.isRequired,

  onDescriptionChange: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func
};

export default injectIntl(Form);
