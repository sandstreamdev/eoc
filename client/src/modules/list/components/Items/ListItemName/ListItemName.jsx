import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class ListItemName extends PureComponent {
  constructor(props) {
    super(props);

    const { name } = this.props;

    this.state = {
      isNameInputFocused: false,
      name
    };
  }

  componentDidUpdate() {
    const { isNameInputFocused } = this.state;

    if (isNameInputFocused) {
      document.addEventListener('keydown', this.handleKeyPress);
    }

    if (!isNameInputFocused) {
      document.removeEventListener('keydown', this.handleKeyPress);
    }
  }

  handleKeyPress = event => {
    const { code } = event;

    // Turn this into ENUM somewhere and change it everywhere across the project
    if (code === 'Enter' || code === 'Escape') {
      this.handleNameUpdate();
    }
  };

  handleNameUpdate = () => {
    // call API to update the name
    const { name } = this.state;

    console.log('updated name is: ', name);
  };

  handleNameChange = event => {
    const {
      target: { value }
    } = event;

    console.log(event.target.value);

    if (value.length > 0) {
      this.setState({ name: value });
    }
  };

  handleNameInputFocus = () => this.setState({ isNameInputFocused: true });

  handleNameInputBlur = () => this.setState({ isNameInputFocused: false });

  handleOnClick = event => event.stopPropagation();

  render() {
    const { name } = this.state;
    const { isNameInputFocused } = this.state;

    return (
      <input
        type="text"
        className={classNames('list-item-name', {
          'primary-input': isNameInputFocused
        })}
        value={name}
        onClick={this.handleOnClick}
        onFocus={this.handleNameInputFocus}
        onBlur={this.handleNameInputBlur}
        onChange={this.handleNameChange}
      />
    );
  }
}

ListItemName.propTypes = {
  name: PropTypes.string.isRequired
};

export default ListItemName;
