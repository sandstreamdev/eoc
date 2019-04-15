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

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = event => {
    const { code } = event;
    const { onEscapePress } = this.props;

    if (code === 'Escape') {
      onEscapePress();
    }
  };

  handleAddNewComment = () => {
    const { onAddNewComment } = this.props;
    const { comment } = this.state;

    onAddNewComment(comment);
  };

  handleCommentChange = value => this.setState({ comment: value });

  render() {
    return (
      <div className="new-comment">
        <div className="new-comment__wrapper" ref={this.commentArea}>
          <Textarea
            onChange={this.handleCommentChange}
            placeholder="Add comment"
          />
          <button
            className="primary-button"
            onClick={this.handleAddNewComment}
            type="button"
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
