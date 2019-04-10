import React, { PureComponent } from 'react';

import Textarea from 'common/components/Forms/Textarea';

class NewComment extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { isNewCommentVisible: false, comment: '' };

    this.commentArea = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
  }

  handleClick = event => {
    if (
      this.state.isNewCommentVisible &&
      !this.commentArea.current.contains(event.target)
    ) {
      this.setState({ isNewCommentVisible: false });
    }
  };

  showAddNewComment = () => {
    debugger;
    this.setState({ isNewCommentVisible: true });
  };

  handleAddNewComment = () => {
    // do some logic
  };

  handleCommentChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ comment: value });
  };

  render() {
    const { isNewCommentVisible } = this.state;
    return (
      <div className="new-comment">
        {isNewCommentVisible ? (
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
        ) : (
          <button
            className="link-button"
            type="button"
            onClick={this.showAddNewComment}
          >
            Add comment
          </button>
        )}
      </div>
    );
  }
}

export default NewComment;
