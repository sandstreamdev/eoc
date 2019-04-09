import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class DescriptionTextarea extends PureComponent {
  constructor(props) {
    super(props);

    this.descriptionTextarea = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress);
    document.addEventListener('mousedown', this.handleClick);

    this.descriptionTextarea.current.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyPress);
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleClick = event => {
    const { handleClick } = this.props;
    const isClickedOutside = !this.descriptionTextarea.current.contains(
      event.target
    );

    handleClick(event, isClickedOutside);
  };

  onKeyPress = event => {
    const { onKeyPress } = this.props;

    onKeyPress(event);
  };

  render() {
    const { description, onDescriptionChange } = this.props;
    return (
      <textarea
        className="desc-textarea primary-textarea"
        name="description"
        onChange={onDescriptionChange}
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
  onDescriptionChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired
};

export default DescriptionTextarea;
