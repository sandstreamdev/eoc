import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Linkify from 'react-linkify';
import { injectIntl } from 'react-intl';

import { dateFromString, formatName } from 'common/utils/helpers';
import Avatar from 'common/components/Avatar';
import './Comment.scss';
import { IntlPropType } from 'common/constants/propTypes';

class Comment extends PureComponent {
  render() {
    const {
      comment,
      intl: { formatMessage }
    } = this.props;
    const { authorName, authorAvatarUrl, createdAt, text } = comment;
    const date = dateFromString(createdAt);
    const formattedName = formatName(authorName, formatMessage);

    return (
      <div className="comment">
        <div className="comment__avatar">
          <Avatar
            avatarUrl={authorAvatarUrl}
            className="comment__image"
            name={formattedName}
          />
        </div>
        <div className="comment__body">
          <span className="comment__author">{formattedName}</span>
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
  comment: PropTypes.objectOf(PropTypes.string).isRequired,
  intl: IntlPropType.isRequired
};

export default injectIntl(Comment);
