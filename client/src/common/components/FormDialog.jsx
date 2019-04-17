import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from 'common/components/Form';
import Dialog from 'common/components/Dialog';

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
      name: defaultName || ''
    };
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleEnterKeypress);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleEnterKeypress);
  }

  handleEnterKeypress = event => event.code === 'Enter' && this.handleConfirm();

  handleDescriptionChange = description => this.setState({ description });

  handleNameChange = name => this.setState({ name });

  handleConfirm = () => {
    const { defaultDescription, defaultName, onConfirm } = this.props;
    const { description, name } = this.state;

    if (defaultDescription !== description || defaultName !== name) {
      name && onConfirm(name, description);
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

    return (
      <Dialog
        onConfirm={this.handleConfirm}
        onCancel={onCancel}
        pending={pending}
        title={title}
      >
        <Form
          defaultDescription={defaultDescription}
          defaultName={defaultName}
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
