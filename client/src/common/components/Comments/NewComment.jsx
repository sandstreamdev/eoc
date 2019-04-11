import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Textarea from 'common/components/Forms/Textarea';

class NewComment extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { comment: '' };

    this.commentArea = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = event => {
    const { code } = event;
    const { onEscapePress } = this.props;

    if (code === 'Escape') {
      onEscapePress();
    }

    if (code === 'Enter') {
      this.handleAddNewComment();
    }
  };

  handleAddNewComment = () => {
    const { onAddNewComment } = this.props;
    const { comment } = this.state;

    onAddNewComment(comment);
  };

  handleCommentChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ comment: value });
  };

  render() {
    return (
      <div className="new-comment">
        <div className="new-comment__wrapper" ref={this.commentArea}>
          <Textarea
            placeholder="Add comment"
            onChange={this.handleCommentChange}
          />
          <button
            className="primary-button"
            type="button"
            onClick={this.handleAddNewComment}
          >
            Add comment
          </button>
        </div>
      </div>
    );
  }
}

NewComment.propTypes = {
  onAddNewComment: PropTypes.func,
  onEscapePress: PropTypes.func
};

export default NewComment;
