import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class CreationForm extends PureComponent {
  state = {
    description: '',
    title: ''
  };

  handleValueChange = event => {
    const {
      target: { value, nodeName }
    } = event;

    nodeName === 'TEXTAREA'
      ? this.setState({ description: value })
      : this.setState({ title: value });
  };

  handleFormSubmission = event => {
    event.preventDefault();
    const { description, title } = this.state;
    const { onSubmit } = this.props;

    onSubmit(title, description);
  };

  render() {
    const { label } = this.props;
    const { description, title } = this.state;
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
            value={title}
          />
        </label>
        <label className="creation-form__label">
          <textarea
            className="creation-form__textarea"
            onChange={this.handleValueChange}
            placeholder="Description"
            type="text"
            value={description}
          />
        </label>
        <input className="creation-form__submit" type="submit" value="Create" />
      </form>
    );
  }
}

CreationForm.propTypes = {
  label: PropTypes.string.isRequired,

  onSubmit: PropTypes.func.isRequired
};

export default CreationForm;
