import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Linkify from 'react-linkify';

import { dateFromString } from 'common/utils/helpers';
import Avatar from 'common/components/Avatar';
import './Comment.scss';

class Comment extends PureComponent {
  render() {
    const { comment } = this.props;
    const { authorName, authorAvatarUrl, createdAt, text } = comment;
    const date = dateFromString(createdAt);

    return (
      <div className="comment">
        <div className="comment__avatar">
          <Avatar
            avatarUrl={authorAvatarUrl}
            className="comment__image"
            name={authorName}
          />
        </div>
        <div className="comment__body">
          <span className="comment__author">{authorName}</span>
          <span className="comment__date">{date}</span>
          <Linkify
            properties={{ target: '_blank', className: 'comment__link' }}
          >
            <p className="comment__content">{text}</p>
          </Linkify>
        </div>
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.string).isRequired
};

export default Comment;
