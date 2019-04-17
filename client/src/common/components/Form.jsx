import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ListType } from 'modules/list';

class Form extends PureComponent {
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
    this.input.current.focus();
  }

  handleNameChange = event => {
    const {
      target: { value }
    } = event;
    const { onNameChange } = this.props;

    this.setState({ name: value });
    onNameChange(value);
  };

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;
    const { onDescriptionChange } = this.props;

    this.setState({ description: value });
    onDescriptionChange(value);
  };

  handleSubmit = event => event.preventDefault();

  handleSelect = event => {
    const { onSelect } = this.props;
    const {
      target: { value }
    } = event;

    onSelect(value);
  };

  render() {
    const { description, name } = this.state;
    const { onSelect } = this.props;

    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <label className="form__label">
          <input
            className="form__input primary-input"
            name="name"
            onChange={this.handleNameChange}
            placeholder="Name"
            ref={this.input}
            type="text"
            value={name}
          />
        </label>
        <label className="form__label">
          <textarea
            className="form__textarea primary-textarea"
            name="description"
            onChange={this.handleDescriptionChange}
            placeholder="Description"
            type="text"
            value={description}
          />
        </label>
        {onSelect && (
          <select
            className="form__select primary-select"
            onChange={this.handleSelect}
          >
            <option value={ListType.LIMITED}>{ListType.LIMITED}</option>
            <option value={ListType.SHARED}>{ListType.SHARED}</option>
          </select>
        )}
      </form>
    );
  }
}

Form.propTypes = {
  defaultDescription: PropTypes.string,
  defaultName: PropTypes.string,

  onDescriptionChange: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func
};

export default Form;
