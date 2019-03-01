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

  handleValueChange = event => {
    const {
      target: { value, nodeName }
    } = event;
    const { handleDescriptionChange, handleNameChange } = this.props;

    if (nodeName === 'TEXTAREA') {
      this.setState({ description: value });
      return handleDescriptionChange(value);
    }
    this.setState({ name: value });
    return handleNameChange(value);
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
              className="form__input"
              onChange={this.handleValueChange}
              placeholder="Name"
              type="text"
              value={name}
            />
          </label>
          <label className="form__label">
            <textarea
              className="form__textarea"
              onChange={this.handleValueChange}
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

  handleDescriptionChange: PropTypes.func.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func
};

export default Form;
