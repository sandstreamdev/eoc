import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Linkify from 'react-linkify';
import classNames from 'classnames';

import { UserIcon } from 'assets/images/icons';
import { dateFromString } from 'common/utils/helpers';
import UserIconPlaceholder from '../../../assets/images/user.svg';

class Comment extends PureComponent {
  state = {
    isAvatarError: false
  };

  handleError = () => this.setState({ isAvatarError: true });

  render() {
    const { comment } = this.props;
    const { authorName, authorAvatarUrl, createdAt, text } = comment;
    const date = dateFromString(createdAt);
    const { isAvatarError } = this.state;

    return (
      <div className="comment">
        <div
          className={classNames('comment__avatar', {
            'comment__avatar--error': isAvatarError
          })}
        >
          {authorAvatarUrl ? (
            <img
              alt={`${authorName} avatar`}
              className="comment__image"
              onError={this.handleError}
              src={isAvatarError ? UserIconPlaceholder : authorAvatarUrl}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div className="comment__body">
          <span className="comment__author">{authorName}</span>
          <span className="comment__date">{date}</span>
          <p className="comment__content">
            <Linkify
              properties={{ target: '_blank', className: 'comment__link' }}
            >
              {text}
            </Linkify>
          </p>
        </div>
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.string).isRequired
};

export default Comment;
