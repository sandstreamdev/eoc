import React, { PureComponent } from 'react';

import Textarea from 'common/components/Forms/Textarea';

class NewComment extends PureComponent {
  state = {
    isNewCommentVisible: false,
    comment: ''
  };

  showAddNewComment = () => this.setState({ isNewCommentVisible: true });

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
    return isNewCommentVisible ? (
      <div className="list-item__add-new">
        <Textarea
          placeholder="Add comment"
          onChange={this.handleCommentChange}
        />
        <button
          className="list-item__button primary-button"
          type="button"
          onClick={this.handleAddNewComment}
        >
          Add comment
        </button>
      </div>
    ) : (
      <button
        className="list-item__button link-button"
        type="button"
        onClick={this.showAddNewComment}
      >
        Add comment
      </button>
    );
  }
}

export default NewComment;
