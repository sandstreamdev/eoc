import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CreationForm extends Component {
  handleValueChange = event => {
    const { onDescriptionChange, onTitleChange } = this.props;
    const {
      target: { value, nodeName }
    } = event;

    nodeName === 'TEXTAREA' ? onDescriptionChange(value) : onTitleChange(value);
  };

  handleFormSubmission = event => {
    event.preventDefault();
    const { descriptionValue, onSubmit, titleValue } = this.props;

    onSubmit(titleValue, descriptionValue);
  };

  render() {
    const { descriptionValue, label, titleValue } = this.props;
    return (
      <form className="creation-form" onSubmit={this.handleFormSubmission}>
        <h2 className="creation-form__heading">{label}</h2>
        <label className="creation-form__label">
          <input
            className="creation-form__input"
            onChange={this.handleValueChange}
            placeholder="Title"
            required
            type="text"
            value={titleValue}
          />
        </label>
        <label className="creation-form__label">
          <textarea
            className="creation-form__textarea"
            onChange={this.handleValueChange}
            placeholder="Description"
            type="text"
            value={descriptionValue}
          />
        </label>
        <input className="creation-form__submit" type="submit" value="Create" />
      </form>
    );
  }
}

CreationForm.propTypes = {
  descriptionValue: PropTypes.string,
  label: PropTypes.string.isRequired,
  titleValue: PropTypes.string,

  onDescriptionChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onTitleChange: PropTypes.func.isRequired
};

export default CreationForm;
