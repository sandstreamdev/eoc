import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Form from 'common/components/Form';
import Overlay, { OverlayStyleType } from 'common/components/Overlay';

class DropdownForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: '',
      name: ''
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escapeListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeListener);
  }

  handleDescriptionChange = description => {
    this.setState({ description });
  };

  handleNameChange = name => {
    this.setState({ name });
  };

  handleSubmission = () => {
    const { onSubmit } = this.props;
    const { description, name } = this.state;
    onSubmit(name, description);
  };

  escapeListener = event => {
    const { code } = event;
    const { onHide } = this.props;
    if (code === 'Escape') {
      onHide && onHide();
    }
  };

  render() {
    const { isVisible, label, onHide } = this.props;

    return (
      isVisible && (
        <Fragment>
          <div className="dropdown-form z-index-high">
            <div className="dropdown-form__header">
              <h2 className="dropdown-form__heading">{label}</h2>
            </div>
            <div className="dropdown-form__body">
              <Form
                onDescriptionChange={this.handleDescriptionChange}
                onNameChange={this.handleNameChange}
                onSubmit={this.handleSubmission}
              />
            </div>
            <div className="dropdown-form__footer">
              <button
                className="dropdown-form__button primary-button"
                onClick={this.handleSubmission}
                type="button"
              >
                Create
              </button>
            </div>
          </div>
          <Overlay onClick={onHide} type={OverlayStyleType.LIGHT} />
        </Fragment>
      )
    );
  }
}
DropdownForm.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,

  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default DropdownForm;
