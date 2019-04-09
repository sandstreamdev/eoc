import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class NameInput extends PureComponent {
  constructor(props) {
    super(props);

    this.nameInput = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress);
    document.addEventListener('mousedown', this.onClick);

    this.nameInput.current.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyPress);
    document.removeEventListener('mousedown', this.onClick);
  }

  onClick = event => {
    const { onClick } = this.props;
    const isClickedOutside = !this.nameInput.current.contains(event.target);

    onClick(event, isClickedOutside);
  };

  onKeyPress = event => {
    const { onKeyPress } = this.props;

    onKeyPress(event);
  };

  render() {
    const { name, onNameChange } = this.props;
    return (
      <input
        className="name-input primary-input"
        name="name"
        onChange={onNameChange}
        ref={this.nameInput}
        type="text"
        value={name}
        required
      />
    );
  }
}

NameInput.propTypes = {
  name: PropTypes.string.isRequired,

  onClick: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired
};

export default NameInput;
