import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import Comment from 'common/components/Comments/Comment';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import NewComment from 'common/components/Comments/NewComment';
import {
  addComment,
  addCommentWS,
  fetchComments
} from 'modules/list/components/Items/model/actions';
import { RouterMatchPropType, IntlPropType } from 'common/constants/propTypes';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';
import { CommentActionTypes } from 'modules/list/components/Items/model/actionTypes';
import Preloader from 'common/components/Preloader';
import socket from 'sockets';

class CommentsList extends PureComponent {
  pendingPromise = null;

  state = {
    isNewCommentVisible: false,
    pending: false
  };

  componentDidMount() {
    this.fetchComments();
    this.receiveWSEvents();
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  receiveWSEvents = () => {
    const { addCommentWS } = this.props;

    socket.on(CommentActionTypes.ADD_SUCCESS, data => {
      const { itemId, listId, json } = data;

      addCommentWS(listId, itemId, json);
    });
  };

  fetchComments = () => {
    const {
      fetchComments,
      itemId,
      itemName,
      match: {
        params: { id: listId }
      }
    } = this.props;

    this.setState({ pending: true });

    this.pendingPromise = makeAbortablePromise(
      fetchComments(itemName, listId, itemId)
    );
    this.pendingPromise.promise
      .then(() => this.setState({ pending: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pending: false });
        }
      });
  };

  showAddComment = () => this.setState({ isNewCommentVisible: true });

  hideAddComment = () => this.setState({ isNewCommentVisible: false });

  handleAddComment = comment => {
    const {
      addComment,
      itemId,
      match: {
        params: { id: listId }
      }
    } = this.props;

    return addComment(listId, itemId, comment, socket);
  };

  render() {
    const {
      comments,
      intl: { formatMessage },
      isFormAccessible
    } = this.props;
    const { isNewCommentVisible, pending } = this.state;

    return (
      <div className="comments">
        <header>
          <h2 className="comments__header">Comments</h2>
          {isFormAccessible && !isNewCommentVisible && (
            <button
              className="list-item__add-new-button link-button"
              onClick={this.showAddComment}
              type="button"
            >
              <FormattedMessage id="common.add-comment" />
            </button>
          )}
        </header>
        {isNewCommentVisible && (
          <NewComment
            onAddComment={this.handleAddComment}
            onClose={this.hideAddComment}
          />
        )}
        <div className="comments__container">
          {!_isEmpty(comments) ? (
            <ul className="comments__list">
              {_map(comments, comment => (
                <Comment comment={comment} key={comment._id} />
              ))}
            </ul>
          ) : (
            <MessageBox
              message={formatMessage({
                id: 'common.comments-list.no-comments'
              })}
              type={MessageType.INFO}
            />
          )}
          {pending && <Preloader />}
        </div>
      </div>
    );
  }
}

CommentsList.propTypes = {
  comments: PropTypes.objectOf(PropTypes.object),
  intl: IntlPropType.isRequired,
  isFormAccessible: PropTypes.bool,
  itemId: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
  match: RouterMatchPropType.isRequired,

  addComment: PropTypes.func.isRequired,
  addCommentWS: PropTypes.func.isRequired,
  fetchComments: PropTypes.func.isRequired
};

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    null,
    { addComment, addCommentWS, fetchComments }
  )
)(CommentsList);
