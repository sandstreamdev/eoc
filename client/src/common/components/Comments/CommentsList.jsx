import React from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';

import Comment from 'common/components/Comments/Comment';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';

const CommentsList = ({ comments }) => (
  <div className="comments">
    <h2 className="comments__heading">Comments</h2>
    {!_isEmpty(comments) ? (
      <ul className="comments__list">
        {_map(comments, comment => (
          <Comment comment={comment} key={comment._id} />
        ))}
      </ul>
    ) : (
      <MessageBox message="There are no comments!" type={MessageType.INFO} />
    )}
  </div>
);

CommentsList.propTypes = {
  comments: PropTypes.objectOf(PropTypes.object)
};

export default CommentsList;
