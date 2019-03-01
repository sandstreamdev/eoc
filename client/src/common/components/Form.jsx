import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const FormType = Object.freeze({
  MENU: 'form/MENU',
  MODAL: 'form/MODAL'
});

class Form extends PureComponent {
  constructor(props) {
    super(props);
    const { defaultDescription, defaultName } = this.props;

    this.state = {
      description: defaultDescription || '',
      name: defaultName || ''
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escapeListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeListener);
  }

  escapeListener = event => {
    const { code } = event;
    const { onHide } = this.props;
    if (code === 'Escape') {
      onHide && onHide();
    }
  };

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

  render() {
    const { type } = this.props;
    const { description, name } = this.state;

    return (
      <Fragment>
        <form
          className={classNames('form z-index-high', {
            'form--menu': type === 'menu'
          })}
          onSubmit={this.handleFormSubmission}
        >
          <label className="form__label">
            <input
              className="form__input"
              onChange={this.handleValueChange}
              placeholder="Name"
              required={type === 'menu'}
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
  type: PropTypes.string,

  handleDescriptionChange: PropTypes.func,
  handleNameChange: PropTypes.func,
  onHide: PropTypes.func
};

export default Form;
