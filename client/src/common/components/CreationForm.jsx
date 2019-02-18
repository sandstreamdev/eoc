import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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

    this.setState({
      description: '',
      title: ''
    });
  };

  render() {
    const { label, type } = this.props;
    const { description, title } = this.state;

    return (
      <form
        className={classNames('creation-form', {
          'creation-form--menu': type === 'menu'
        })}
        onSubmit={this.handleFormSubmission}
      >
        <h2 className="creation-form__heading">{label}</h2>
        <label className="creation-form__label">
          <input
            className="creation-form__input"
            onChange={this.handleValueChange}
            placeholder="Title"
            required={type === 'menu'}
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
  label: PropTypes.string,
  type: PropTypes.string,

  onSubmit: PropTypes.func.isRequired
};

export default CreationForm;
