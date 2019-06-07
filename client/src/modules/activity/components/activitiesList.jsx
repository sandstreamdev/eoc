import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Activity from './activity';
import Preloader from 'common/components/Preloader';
import { fetchActivities } from '../model/actions';
import { getActivities } from '../model/selectors';

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
      <div>
        <ul>
          {activities.map(activity => (
            <li key={activity._id}>
              <Activity activity={activity} />
            </li>
          ))}
        </ul>
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
