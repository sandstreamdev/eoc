import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  injectIntl,
  FormattedMessage,
  FormattedRelativeTime
} from 'react-intl';
import { selectUnit } from '@formatjs/intl-utils';

import Avatar from 'common/components/Avatar';
import './Activity.scss';
import { formatName } from 'common/utils/helpers';
import { IntlPropType } from 'common/constants/propTypes';

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
      activity: { activityType, cohort, editedValue, item, list, performer },
      intl: { formatMessage }
    } = this.props;
    const formattedName = formatName(performer.name, formatMessage);

    return (
      <>
        <FormattedMessage
          id={activityType}
          values={{
            item: item ? <em className="activity__item">{item.name}</em> : null,
            list: list ? <em className="activity__item">{list.name}</em> : null,
            performer: <em>{formattedName}</em>,
            value: <em>{editedValue}</em>
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
      </>
    );
  };

  renderListActivity = () => {
    const {
      activity: { activityType, cohort, editedUser, editedValue, performer },
      intl: { formatMessage }
    } = this.props;
    const formattedName = formatName(performer.name, formatMessage);
    const formattedNameEditedUser = editedUser
      ? formatName(editedUser.name, formatMessage)
      : null;

    return (
      <>
        <FormattedMessage
          id={activityType}
          values={{
            list: <em>{this.renderListLink()}</em>,
            performer: <em>{formattedName}</em>,
            user: formattedNameEditedUser,
            value: editedValue
          }}
        />
        {cohort && (
          <FormattedMessage
            id="activity.cohort"
            values={{ cohort: this.renderCohortLink() }}
          />
        )}
      </>
    );
  };

  renderCohortActivity = () => {
    const {
      activity: { activityType, editedUser, editedValue, performer },
      intl: { formatMessage }
    } = this.props;
    const formattedName = formatName(performer.name, formatMessage);
    const formattedNameEditedUser = editedUser
      ? formatName(editedUser.name, formatMessage)
      : null;

    return (
      <FormattedMessage
        id={activityType}
        values={{
          cohort: <em>{this.renderCohortLink()}</em>,
          performer: <em>{formattedName}</em>,
          user: formattedNameEditedUser,
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
      },
      intl: { formatMessage }
    } = this.props;
    const formattedName = formatName(name, formatMessage);
    // const { value, unit } = selectUnit(Date.parse(createdAt), Date.now());
    const { value, unit } = selectUnit(Date.parse(createdAt));

    return (
      <div className="activity">
        <div className="activity__avatar">
          <Avatar
            avatarUrl={avatarUrl}
            className="activity__image"
            name={formattedName}
          />
        </div>
        <div className="activity__message">
          <p className="activity__action">
            {item && this.renderItemActivity()}
            {list && !item && this.renderListActivity()}
            {cohort && !list && this.renderCohortActivity()}
          </p>
          <p className="activity__date">
            <FormattedRelativeTime value={value} unit={unit} />
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
  }),
  intl: IntlPropType.isRequired
};

export default injectIntl(Activity);
