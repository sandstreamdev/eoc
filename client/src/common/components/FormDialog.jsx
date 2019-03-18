import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from 'common/components/Form';
import Dialog from 'common/components/Dialog';

export const FormDialogContext = Object.freeze({
  COHORT: 'cohort',
  LIST: 'list'
});

class FormDialog extends Component {
  constructor(props) {
    super(props);
    const { defaultDescription, defaultName } = this.props;

    this.state = {
      description: defaultDescription || '',
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
    event.code === 'Enter' && this.handleFormSubmission();
  };

  handleDescriptionChange = description => {
    this.setState({ description });
  };

  handleNameChange = name => {
    this.setState({ name });
  };

  handleConfirm = () => {
    const { defaultDescription, defaultName, onConfirm } = this.props;
    const { description, name } = this.state;

    if (defaultDescription !== description || defaultName !== name) {
      name && onConfirm(name, description);
    }
  };

  handleCancel = () => {
    const { onCancel } = this.props;

    onCancel();
  };

  render() {
    const {
      defaultDescription,
      defaultName,
      isNameRequired,
      title
    } = this.props;

    return (
      <Dialog
        onConfirm={this.handleConfirm}
        onCancel={this.handleCancel}
        title={title}
      >
        <Form
          defaultDescription={defaultDescription}
          defaultName={defaultName}
          isNameRequired={isNameRequired}
          onDescriptionChange={this.handleDescriptionChange}
          onNameChange={this.handleNameChange}
        />
      </Dialog>
    );
  }
}

FormDialog.propTypes = {
  defaultDescription: PropTypes.string,
  defaultName: PropTypes.string,
  isNameRequired: PropTypes.bool,
  title: PropTypes.string,

  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
};

export default FormDialog;
