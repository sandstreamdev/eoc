import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class NameInput extends PureComponent {
  constructor(props) {
    super(props);

    this.nameInput = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    document.addEventListener('mousedown', this.handleClick);

    this.nameInput.current.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleClick = event => {
    const { handleClick } = this.props;
    const isClickedOutside = !this.nameInput.current.contains(event.target);

    handleClick(event, isClickedOutside);
  };

  handleKeyPress = event => {
    const { handleKeyPress } = this.props;

    handleKeyPress(event);
  };

  render() {
    const { name, handleNameChange } = this.props;
    return (
      <input
        className="name-input primary-input"
        name="name"
        onChange={handleNameChange}
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

  handleClick: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  handleNameChange: PropTypes.func.isRequired
};

export default NameInput;
