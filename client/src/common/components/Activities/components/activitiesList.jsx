import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Activity from './activity';
import Preloader from 'common/components/Preloader';
import { fetchActivities } from '../model/actions';
import { getActivities } from '../model/selectors';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';

class ActivitiesList extends PureComponent {
  state = {
    pending: false
  };

  componentDidMount() {
    const { fetchActivities } = this.props;

    this.setState({ pending: false });

    fetchActivities().finally(this.setState({ pending: false }));
  }

  render() {
    const { activities } = this.props;
    const { pending } = this.state;
    return (
      <div className="activities-list">
        <h2 className="activities-list__heading">Activities</h2>
        {activities.length ? (
          <ul className="activities-list__list">
            {activities.map(activity => (
              <li key={activity._id}>
                <Activity activity={activity} />
              </li>
            ))}
          </ul>
        ) : (
          <MessageBox
            message="There are no activities."
            type={MessageType.INFO}
          />
        )}
        {pending && <Preloader />}
      </div>
    );
  }
}

ActivitiesList.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.object),

  fetchActivities: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  activities: getActivities(state)
});

export default connect(
  mapStateToProps,
  { fetchActivities }
)(ActivitiesList);
