import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';

import Form from 'common/components/Form';
import Dialog from 'common/components/Dialog';
import { KeyCodes } from 'common/constants/enums';
import { validateWith } from 'common/utils/helpers';

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

  componentDidMount() {
    document.addEventListener('keypress', this.handleEnterKeypress);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleEnterKeypress);
  }

  handleEnterKeypress = event => {
    const { code } = event;

    if (code === KeyCodes.ENTER) {
      this.validateName();
    }
  };

  handleDescriptionChange = description => this.setState({ description });

  handleNameChange = name => this.setState({ name });

  validateName = () => {
    const { name } = this.state;

    const errorMessageId = validateWith(value =>
      validator.isLength(value, { min: 1, max: 32 })
    )('user.auth.input.email.invalid')(name);

    this.setState({ errorMessageId }, this.handleConfirm);
  };

  handleConfirm = () => {
    const { defaultDescription, defaultName, onConfirm } = this.props;
    const { description, name, errorMessageId } = this.state;

    if (!errorMessageId) {
      if (defaultDescription !== description || defaultName !== name) {
        return name && onConfirm(name, description);
      }
    }
  };

  render() {
    const {
      defaultDescription,
      defaultName,
      onCancel,
      onSelect,
      pending,
      title
    } = this.props;
    const { errorMessageId } = this.state;

    return (
      <Dialog
        onConfirm={this.validateName}
        onCancel={onCancel}
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
  pending: PropTypes.bool.isRequired,
  title: PropTypes.string,

  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onSelect: PropTypes.func
};

export default FormDialog;
