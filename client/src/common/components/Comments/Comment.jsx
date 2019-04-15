import React from 'react';
import PropTypes from 'prop-types';

import { UserIcon } from 'assets/images/icons';

const Comment = ({ author, comment, avatar }) => (
  <div className="comment">
    <div className="comment__avatar">
      {avatar ? (
        <img src={avatar} alt={`${author} avatar`} name={`${author} avatar`} />
      ) : (
        <UserIcon />
      )}
    </div>
    <div className="comment__body">
      <span className="comment__author">{author}</span>
      <p className="comment__content">{comment}</p>
    </div>
  </div>
);

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  avatar: PropTypes.node,
  comment: PropTypes.string.isRequired
};

export default Comment;
