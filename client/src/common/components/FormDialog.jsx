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
      this.handleConfirm();
    }
  };

  handleDescriptionChange = description => this.setState({ description });

  handleNameChange = name => this.setState({ name }, this.validateName);

  validateName = callback => {
    const { name } = this.state;

    const errorMessageId = validateWith(value =>
      validator.isLength(value, { min: 1, max: 32 })
    )('common.form.required-warning')(name);

    this.setState({ errorMessageId }, callback);
  };

  handleConfirm = () => {
    const { defaultDescription, defaultName, onConfirm } = this.props;
    const { description, name } = this.state;

    const nameDiffers = defaultName !== name;
    const descriptionDiffers = defaultDescription !== description;
    const differs = descriptionDiffers || nameDiffers;

    if (name && differs) {
      onConfirm(name, description);
    }
  };

  handleConfirmClick = () => this.validateName(this.handleConfirm);

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
        onConfirm={this.handleConfirmClick}
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
