import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { dateFromString } from 'common/utils/helpers';
import Avatar from 'common/components/Avatar';

class Activity extends PureComponent {
  renderCohortInfo = () => {
    const {
      activity: { cohort }
    } = this.props;

    return cohort ? (
      <Link className="activity__link" to={`/cohort/${cohort.id}`}>
        {cohort.name}
      </Link>
    ) : null;
  };

  renderListInfo = () => {
    const {
      activity: { list }
    } = this.props;

    return list ? (
      <Link className="activity__link" to={`/sack/${list.id}`}>
        {list.name}
      </Link>
    ) : null;
  };

  render() {
    const {
      activity: { activityType, createdAt, item, performer }
    } = this.props;
    const date = dateFromString(createdAt);
    console.log(activityType);

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
            <FormattedMessage
              id={activityType}
              values={{
                performer: performer ? performer.name : null,
                item: <em>{item ? item.name : null}</em>,
                list: this.renderListInfo(),
                cohort: this.renderCohortInfo()
              }}
            />
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
