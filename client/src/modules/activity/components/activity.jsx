import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { ActivityType } from 'common/constants/enums';
import { dateFromString } from 'common/utils/helpers';
import UserIconPlaceholder from 'assets/images/user.svg';
import { UserIcon } from 'assets/images/icons';

class Activity extends PureComponent {
  state = {
    isAvatarError: false
  };

  handleAvatarError = () => this.setState({ isAvatarError: true });

  render() {
    const {
      activity: {
        activityType,
        actor: { actorAvatarUrl, actorName },
        createdAt,
        item: { itemId, itemName },
        list: { listId, listName }
      }
    } = this.props;
    const { isAvatarError } = this.state;
    const date = dateFromString(createdAt);

    return (
      <div className="activity">
        <div
          className={classNames('activity', {
            'activity--error': isAvatarError
          })}
        >
          {actorAvatarUrl ? (
            <img
              alt={`${actorName} avatar`}
              className="activity_image"
              onError={this.handleAvatarError}
              src={isAvatarError ? UserIconPlaceholder : actorAvatarUrl}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div className="activity__message" />
        <p />
      </div>
    );
  }
}

Activity.propTypes = {
  activity: PropTypes.shapeOf({
    activityType: PropTypes.string.isRequired,
    actor: PropTypes.objectOf(PropTypes.string).isRequired,
    cohort: PropTypes.objectOf(PropTypes.string),
    createdAt: PropTypes.string.isRequired,
    item: PropTypes.objectOf(PropTypes.string).isRequired,
    list: PropTypes.objectOf(PropTypes.string).isRequired
  })
};

export default Activity;
