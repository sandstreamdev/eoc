import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class DescriptionTextarea extends PureComponent {
  constructor(props) {
    super(props);

    this.descriptionTextarea = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    document.addEventListener('mousedown', this.handleClick);

    this.descriptionTextarea.current.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleClick = event => {
    const { handleClick } = this.props;
    const isClickedOutside = !this.descriptionTextarea.current.contains(
      event.target
    );

    handleClick(event, isClickedOutside);
  };

  handleKeyPress = event => {
    const { handleKeyPress } = this.props;

    handleKeyPress(event);
  };

  render() {
    const { description, handleDescriptionChange } = this.props;
    return (
      <textarea
        className="desc-textarea primary-textarea"
        name="description"
        onChange={handleDescriptionChange}
        ref={this.descriptionTextarea}
        type="text"
        value={description}
      />
    );
  }
}

DescriptionTextarea.propTypes = {
  description: PropTypes.string.isRequired,

  handleClick: PropTypes.func.isRequired,
  handleDescriptionChange: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired
};

export default DescriptionTextarea;
