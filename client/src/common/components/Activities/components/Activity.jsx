import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { dateFromString } from 'common/utils/helpers';
import Avatar from 'common/components/Avatar';

class Activity extends PureComponent {
  renderCohortInfo = () => {
    const {
      activity: { cohort }
    } = this.props;

    if (cohort) {
      const { cohortId, cohortName } = cohort;

      return (
        <Fragment>
          {' in '}
          <Link className="activity__link" to={`/cohort/${cohortId}`}>
            {cohortName}
          </Link>
          {' cohort'}
        </Fragment>
      );
    }
  };

  renderListInfo = () => {
    const {
      activity: { list }
    } = this.props;

    if (list) {
      const { listId, listName } = list;

      return (
        <Fragment>
          <Link className="activity__link" to={`/sack/${listId}`}>
            {listName}
          </Link>
        </Fragment>
      );
    }
  };

  render() {
    const {
      activity: {
        performer: { performerAvatarUrl, performerName },
        createdAt,
        item: { itemName }
      }
    } = this.props;
    const date = dateFromString(createdAt);

    return (
      <div className="activity">
        <div className="activity__avatar">
          <Avatar
            avatarUrl={performerAvatarUrl}
            className="activity__image"
            name={performerName}
          />
        </div>
        <div className="activity__message">
          <p className="activity__action">
            {`${performerName} added ${
              itemName ? `"${itemName}"` : ''
            } item to `}
            {this.renderListInfo()}
            {' sack'}
            {this.renderCohortInfo()}
            {'.'}
          </p>
          <p className="activity__date">{date}</p>
        </div>
      </div>
    );
  }
}

Activity.propTypes = {
  activity: PropTypes.shape({
    activityType: PropTypes.string.isRequired,
    performer: PropTypes.objectOf(PropTypes.string).isRequired,
    cohort: PropTypes.objectOf(PropTypes.string),
    createdAt: PropTypes.string.isRequired,
    editedValue: PropTypes.string,
    editedUser: PropTypes.objectOf(PropTypes.string),
    item: PropTypes.objectOf(PropTypes.string),
    list: PropTypes.objectOf(PropTypes.string)
  })
};

export default Activity;
