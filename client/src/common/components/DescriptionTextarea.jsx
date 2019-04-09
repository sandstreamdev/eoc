import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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

  onClick: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired
};

export default DescriptionTextarea;
