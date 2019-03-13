import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

class Form extends PureComponent {
  constructor(props) {
    super(props);
    const { defaultDescription, defaultName } = this.props;

    this.state = {
      description: defaultDescription || '',
      name: defaultName || ''
    };
  }

  handleNameChange = event => {
    const {
      target: { value }
    } = event;
    const { onNameChange } = this.props;

    this.setState({ name: value });
    onNameChange && onNameChange(value);
  };

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;
    const { onDescriptionChange } = this.props;

    this.setState({ description: value });
    onDescriptionChange && onDescriptionChange(value);
  };

  handleFormSubmission = event => {
    event.preventDefault();
    const { onSubmit } = this.props;

    onSubmit && onSubmit();
  };

  render() {
    const { description, name } = this.state;

    return (
      <Fragment>
        <form
          className="form z-index-high"
          onSubmit={this.handleFormSubmission}
        >
          <label className="form__label">
            <input
              className="form__input primary-input"
              onChange={this.handleNameChange}
              placeholder="Name"
              type="text"
              value={name}
            />
          </label>
          <label className="form__label">
            <textarea
              className="form__textarea primary-textarea"
              onChange={this.handleDescriptionChange}
              placeholder="Description"
              type="text"
              value={description}
            />
          </label>
        </form>
      </Fragment>
    );
  }
}

Form.propTypes = {
  defaultDescription: PropTypes.string,
  defaultName: PropTypes.string,

  onDescriptionChange: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func
};

export default Form;
