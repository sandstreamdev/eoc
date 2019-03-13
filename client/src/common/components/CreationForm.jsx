import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';

export const CreationFormType = Object.freeze({
  MENU: 'creation-form/MENU',
  MODAL: 'creation-form/MODAL'
});

class CreationForm extends PureComponent {
  constructor(props) {
    super(props);
    const { defaultDescription, defaultName } = this.props;

    this.state = {
      description: defaultDescription || '',
      name: defaultName || ''
    };

    this.input = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escapeListener);
    this.input.current.focus();
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

    nodeName === 'TEXTAREA'
      ? this.setState({ description: value })
      : this.setState({ name: value });
  };

  handleFormSubmission = event => {
    event.preventDefault();
    const { description, name } = this.state;
    const { onSubmit } = this.props;

    onSubmit(name, description);

    this.setState({
      description: '',
      name: ''
    });
  };

  render() {
    const { defaultName, label, onCancel, onHide, type } = this.props;
    const { description, name } = this.state;

    return (
      <Fragment>
        <form
          className={classNames('creation-form z-index-high', {
            'creation-form--menu': type === 'menu'
          })}
          onSubmit={this.handleFormSubmission}
        >
          <div className="creation-form__header">
            <h2 className="creation-form__heading">{label}</h2>
          </div>
          <div className="creation-form__body">
            <label className="creation-form__label">
              <input
                className="creation-form__input primary-input"
                onChange={this.handleValueChange}
                placeholder="Name"
                ref={this.input}
                required={type === 'menu'}
                type="text"
                value={name}
              />
            </label>
            <label className="creation-form__label">
              <textarea
                className="creation-form__textarea primary-textarea"
                onChange={this.handleValueChange}
                placeholder="Description"
                type="text"
                value={description}
              />
            </label>
            <div className="creation-form__controls">
              <input
                className="creation-form__submit primary-button"
                type="submit"
                value={defaultName ? 'Update' : 'Create'}
              />
              {onCancel && (
                <button
                  className="creation-form__cancel-button primary-button"
                  onClick={onCancel}
                  type="button"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
        <Overlay onClick={onHide} type={OverlayStyleType.LIGHT} />
      </Fragment>
    );
  }
}

CreationForm.propTypes = {
  defaultDescription: PropTypes.string,
  defaultName: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,

  onCancel: PropTypes.func,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
};

export default CreationForm;
