import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import _trim from 'lodash/trim';
import { injectIntl } from 'react-intl';

import Form from 'common/components/Form';
import Dialog from 'common/components/Dialog';
import { KeyCodes } from 'common/constants/enums';
import { validateWith } from 'common/utils/helpers';
import { IntlPropType } from 'common/constants/propTypes';

export const FormDialogContext = Object.freeze({
  CREATE_COHORT: 'formDialog/CREATE_COHORT',
  CREATE_LIST: 'formDialog/CREATE_LIST'
});

class FormDialog extends Component {
  constructor(props) {
    super(props);
    const { defaultDescription, defaultName } = this.props;

    this.state = {
      description: defaultDescription || '',
      errorMessageId: '',
      name: defaultName || ''
    };
  }

  componentDidUpdate() {
    const { isVisible } = this.props;

    if (isVisible) {
      document.addEventListener('keypress', this.handleEnterKeypress);
    } else {
      document.removeEventListener('keypress', this.handleEnterKeypress);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleEnterKeypress);
  }

  handleEnterKeypress = event => {
    const { code } = event;

    if (code === KeyCodes.ENTER) {
      this.handleConfirmAction();
    }
  };

  handleDescriptionChange = value => {
    const description = _trim(value) === '' ? '' : value;

    this.setState({ description });
  };

  handleNameChange = name => this.setState({ name }, this.validateName);

  validateName = callback => {
    const { name } = this.state;
    let errorMessageId;

    errorMessageId = validateWith(
      value => !validator.isEmpty(value, { ignore_whitespace: true })
    )('common.form.required-warning')(name);

    if (_trim(name)) {
      errorMessageId = validateWith(value =>
        validator.isLength(value, { min: 1, max: 32 })
      )('common.form.field-min-max')(name);
    }

    this.setState({ errorMessageId }, callback);
  };

  handleConfirm = () => {
    const { defaultDescription, defaultName, onConfirm } = this.props;
    const { description, name, errorMessageId } = this.state;

    const nameDiffers = defaultName !== name;
    const descriptionDiffers = defaultDescription !== description;
    const differs = descriptionDiffers || nameDiffers;

    if (!errorMessageId && differs) {
      onConfirm(name, description);
    }
  };

  handleConfirmAction = () => this.validateName(this.handleConfirm);

  render() {
    const {
      defaultDescription,
      defaultName,
      intl: { formatMessage },
      isVisible,
      onCancel,
      onSelect,
      pending,
      title
    } = this.props;
    const { errorMessageId } = this.state;

    return (
      <Dialog
        cancelLabel={formatMessage({ id: 'common.button.cancel' })}
        confirmLabel={formatMessage({ id: 'common.button.confirm' })}
        isVisible={isVisible}
        onCancel={onCancel}
        onConfirm={this.handleConfirmAction}
        pending={pending}
        title={title}
      >
        <Form
          defaultDescription={defaultDescription}
          defaultName={defaultName}
          disabled={pending}
          errorMessageId={errorMessageId}
          onDescriptionChange={this.handleDescriptionChange}
          onNameChange={this.handleNameChange}
          onSelect={onSelect}
        />
      </Dialog>
    );
  }
}

FormDialog.propTypes = {
  defaultDescription: PropTypes.string,
  defaultName: PropTypes.string,
  intl: IntlPropType.isRequired,
  isVisible: PropTypes.bool.isRequired,
  pending: PropTypes.bool.isRequired,
  title: PropTypes.string,

  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onSelect: PropTypes.func
};

export default injectIntl(FormDialog);
