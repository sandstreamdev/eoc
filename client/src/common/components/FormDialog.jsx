import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from 'common/components/Form';
import Dialog from 'common/components/Dialog';

class FormDialog extends Component {
  state = {
    description: '',
    name: ''
  };

  handleDescriptionChange = description => {
    this.setState({ description });
  };

  handleNameChange = name => {
    this.setState({ name });
  };

  handleFormSubmission = () => {
    const { onConfirm } = this.props;
    const { description, name } = this.state;

    onConfirm(name, description);
  };

  handleCancel = () => {
    const { onCancel } = this.props;

    onCancel();
  };

  render() {
    const { defaultDescription, defaultName, title } = this.props;
    return (
      <Dialog
        onConfirm={this.handleFormSubmission}
        onCancel={this.handleCancel}
        title={title}
      >
        <Form
          defaultDescription={defaultDescription}
          defaultName={defaultName}
          handleDescriptionChange={this.handleDescriptionChange}
          handleNameChange={this.handleNameChange}
          onSubmit={this.handleFormSubmission}
        />
      </Dialog>
    );
  }
}

FormDialog.propTypes = {
  defaultDescription: PropTypes.string,
  defaultName: PropTypes.string,
  title: PropTypes.string,

  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
};

export default FormDialog;
