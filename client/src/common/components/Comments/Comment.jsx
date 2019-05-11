import React from 'react';
import PropTypes from 'prop-types';

import { UserIcon } from 'assets/images/icons';
import { dateFromString } from 'common/utils/helpers';

const Comment = ({ comment }) => {
  const { authorName, authorAvatarUrl, createdAt, text } = comment;
  const date = dateFromString(createdAt);

  return (
    <div className="comment">
      <div className="comment__avatar">
        {authorAvatarUrl ? (
          <img alt={`${authorName} avatar`} src={authorAvatarUrl} />
        ) : (
          <UserIcon />
        )}
      </div>
      <div className="comment__body">
        <span className="comment__author">{authorName}</span>
        <span className="comment__date">{date}</span>
        <p className="comment__content">{text}</p>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.string).isRequired
};

export default Comment;
