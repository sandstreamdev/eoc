import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';

class CreationForm extends PureComponent {
  state = {
    description: '',
    title: ''
  };

  componentDidMount() {
    document.addEventListener('keydown', this.escapeListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeListener);
  }

  escapeListener = event => {
    const { code } = event;
    const { onFormsHide } = this.props;
    if (code === 'Escape') {
      onFormsHide();
    }
  };

  overlayHandler = () => {
    const { onFormsHide } = this.props;

    onFormsHide();
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
      <Fragment>
        <form
          className={classNames('creation-form z-index-high', {
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
          <input
            className="creation-form__submit"
            type="submit"
            value="Create"
          />
        </form>
        <Overlay type={OverlayStyleType.LIGHT} onClick={this.overlayHandler} />
      </Fragment>
    );
  }
}

CreationForm.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,

  onFormsHide: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
};

export default CreationForm;
