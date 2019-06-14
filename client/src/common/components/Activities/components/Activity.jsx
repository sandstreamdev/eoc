import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { dateFromString } from 'common/utils/helpers';
import Avatar from 'common/components/Avatar';

class Activity extends PureComponent {
  renderCohortLink = () => {
    const {
      activity: {
        cohort: { id, name }
      }
    } = this.props;

    return (
      <Link className="activity__link" to={`/cohort/${id}`}>
        {name}
      </Link>
    );
  };

  renderListLink = () => {
    const {
      activity: {
        list: { id, name }
      }
    } = this.props;

    return (
      <Link className="activity__link" to={`/sack/${id}`}>
        {name}
      </Link>
    );
  };

  renderItemActivity = () => {
    const {
      activity: { activityType, cohort, editedValue, item, list, performer }
    } = this.props;

    return (
      <Fragment>
        <FormattedMessage
          id={activityType}
          values={{
            item: item ? <em>{item.name}</em> : null,
            performer: <em>{performer.name}</em>,
            value: editedValue
          }}
        />
        {list && (
          <FormattedMessage
            id="activity.list"
            values={{ list: this.renderListLink() }}
          />
        )}
        {cohort && (
          <FormattedMessage
            id="activity.cohort"
            values={{ cohort: this.renderCohortLink() }}
          />
        )}
      </Fragment>
    );
  };

  renderListActivity = () => {
    const {
      activity: { activityType, cohort, editedUser, editedValue, performer }
    } = this.props;

    return (
      <Fragment>
        <FormattedMessage
          id={activityType}
          values={{
            list: <em>{this.renderListLink()}</em>,
            performer: <em>{performer.name}</em>,
            user: editedUser ? editedUser.name : null,
            value: editedValue
          }}
        />
        {cohort && (
          <FormattedMessage
            id="activity.cohort"
            values={{ cohort: this.renderCohortLink() }}
          />
        )}
      </Fragment>
    );
  };

  renderCohortActivity = () => {
    const {
      activity: { activityType, editedUser, editedValue, performer }
    } = this.props;

    return (
      <FormattedMessage
        id={activityType}
        values={{
          cohort: <em>{this.renderCohortLink()}</em>,
          performer: <em>{performer.name}</em>,
          user: editedUser ? editedUser.name : null,
          value: editedValue
        }}
      />
    );
  };

  render() {
    const {
      activity: { cohort, createdAt, item, list, performer }
    } = this.props;
    const date = dateFromString(createdAt);

    return (
      <div className="activity">
        <div className="activity__avatar">
          <Avatar
            avatarUrl={performer ? performer.avatarUrl : null}
            className="activity__image"
            name={performer ? performer.name : null}
          />
        </div>
        <div className="activity__message">
          <p className="activity__action">
            {item && this.renderItemActivity()}
            {list && !item && this.renderListActivity()}
            {cohort && !list && this.renderCohortActivity()}
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
    performer: PropTypes.objectOf(PropTypes.string),
    cohort: PropTypes.objectOf(PropTypes.string),
    createdAt: PropTypes.string.isRequired,
    editedValue: PropTypes.string,
    editedUser: PropTypes.objectOf(PropTypes.string),
    item: PropTypes.objectOf(PropTypes.string),
    list: PropTypes.objectOf(PropTypes.string)
  })
};

export default Activity;
