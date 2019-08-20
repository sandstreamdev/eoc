import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';

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
            item: item ? <em className="activity__item">{item.name}</em> : null,
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
      activity: {
        cohort,
        createdAt,
        item,
        list,
        performer: { avatarUrl, name }
      }
    } = this.props;

    return (
      <div className="activity">
        <div className="activity__avatar">
          <Avatar
            avatarUrl={avatarUrl}
            className="activity__image"
            name={name}
          />
        </div>
        <div className="activity__message">
          <p className="activity__action">
            {item && this.renderItemActivity()}
            {list && !item && this.renderListActivity()}
            {cohort && !list && this.renderCohortActivity()}
          </p>
          <p className="activity__date">
            <FormattedRelative value={createdAt} />
          </p>
        </div>
      </div>
    );
  }
}

Activity.propTypes = {
  activity: PropTypes.shape({
    activityType: PropTypes.string.isRequired,
    cohort: PropTypes.objectOf(PropTypes.string),
    createdAt: PropTypes.string.isRequired,
    editedUser: PropTypes.objectOf(PropTypes.string),
    editedValue: PropTypes.string,
    item: PropTypes.objectOf(PropTypes.string),
    list: PropTypes.objectOf(PropTypes.string),
    performer: PropTypes.objectOf(PropTypes.string)
  })
};

export default Activity;
