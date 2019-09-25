import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './DescriptionTextarea.scss';

class DescriptionTextarea extends PureComponent {
  constructor(props) {
    super(props);

    this.descriptionTextarea = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress);
    document.addEventListener('mousedown', this.onClick);

    this.descriptionTextarea.current.focus();
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;

    onUnmount();
    document.removeEventListener('keydown', this.onKeyPress);
    document.removeEventListener('mousedown', this.onClick);
  }

  onClick = event => {
    const { onClick } = this.props;
    const isClickedOutside = !this.descriptionTextarea.current.contains(
      event.target
    );

    onClick(event, isClickedOutside);
  };

  onKeyPress = event => {
    const { onKeyPress } = this.props;

    onKeyPress(event);
  };

  render() {
    const { description, disabled, onDescriptionChange, onFocus } = this.props;

    return (
      <div className="desc-textarea">
        <textarea
          className="desc-textarea__textarea primary-textarea"
          disabled={disabled}
          name="description"
          onChange={onDescriptionChange}
          onFocus={onFocus}
          ref={this.descriptionTextarea}
          type="text"
          value={description}
        />
        <input
          className={classNames('desc-textarea__submit primary-button', {
            'desc-textarea__submit--disabled': disabled
          })}
          disabled={disabled}
          type="submit"
          value="save"
        />
      </div>
    );
  }
}

DescriptionTextarea.propTypes = {
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,

  onClick: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired
};

export default DescriptionTextarea;
