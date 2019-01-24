import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CreationForm extends Component {
  handleValueChange = event => {
    const { onTitleChange, onDescriptionChange } = this.props;
    const {
      target: { value }
    } = event;

    event.target.nodeName === 'TEXTAREA'
      ? onDescriptionChange(value)
      : onTitleChange(value);
  };

  handleFormSubmission = event => {
    event.preventDefault();
    const { onSubmit, titleValue, descriptionValue } = this.props;

    onSubmit(titleValue, descriptionValue);
  };

  render() {
    const { label, titleValue, descriptionValue } = this.props;
    return (
      <form className="creation-form" onSubmit={this.handleFormSubmission}>
        <h2 className="creation-form__heading">{label}</h2>
        <label className="creation-form__label">
          <input
            className="creation-form__input"
            placeholder="Title"
            required
            onChange={this.handleValueChange}
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
        <input type="submit" className="creation-form__submit" value="Create" />
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
