import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class MembersForm extends PureComponent {
  state = {
    inputValue: ''
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleAddNew);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleAddNew);
  }

  handleInputChange = event => {
    const {
      target: { value }
    } = event;
    this.setState({ inputValue: value });
  };

  handleAddNew = event => {
    const { code } = event;
    const { onAddNew } = this.props;
    const { inputValue } = this.state;

    if (code === 'Enter') {
      onAddNew(inputValue);
      this.setState({ inputValue: '' });
    }
  };

  handleSubmit = event => event.preventDefault();

  render() {
    const { inputValue } = this.state;
    return (
      <form className="members-form" onSubmit={this.handleSubmit}>
        <input
          className="members-form__input primary-input"
          onChange={this.handleInputChange}
          placeholder="Enter email"
          type="email"
          value={inputValue}
        />
        <input className="primary-button" type="submit" value="Add new" />
      </form>
    );
  }
}

MembersForm.propTypes = {
  onAddNew: PropTypes.func.isRequired
};

export default MembersForm;
