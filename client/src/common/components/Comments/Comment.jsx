import React from 'react';
import PropTypes from 'prop-types';

import { CohortIcon } from 'assets/images/icons';

const Comment = ({ author, comment, avatar }) => (
  <div className="comment">
    <div className="comment__avatar">
      {/* Cohort icon is temporary for now, it will be user avatar here */}
      <CohortIcon />
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
