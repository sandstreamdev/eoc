import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';
import _flowRight from 'lodash/flowRight';
import { injectIntl } from 'react-intl';

import Activity from './Activity';
import Preloader from 'common/components/Preloader';
import {
  fetchActivities,
  removeActivities,
  resetShouldUpdate
} from '../model/actions';
import {
  getActivities,
  getIsNextPage,
  getNextPage,
  getShouldUpdate
} from '../model/selectors';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';
import PendingButton from 'common/components/PendingButton';
import { IntlPropType, UserPropType } from 'common/constants/propTypes';
import { enterView, leaveView } from 'sockets';
import { getCurrentUser } from 'modules/authorization/model/selectors';

class ActivitiesList extends PureComponent {
  pendingPromise = null;

  state = {
    pending: false
  };

  componentDidMount() {
    const {
      currentUser: { id }
    } = this.props;

    this.handleShowActivities();
    enterView('activities', id);
  }

  componentDidUpdate(prevProps) {
    const { shouldUpdate: prevShouldUpdate } = prevProps;
    const { shouldUpdate } = this.props;

    if (prevShouldUpdate !== shouldUpdate) {
      this.handleUpdateActivities();
    }
  }

  componentWillUnmount() {
    const {
      currentUser: { id },
      removeActivities
    } = this.props;

    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }

    removeActivities();
    leaveView('activities', id);
  }

  handleUpdateActivities = () => {
    const { fetchActivities, resetShouldUpdate } = this.props;

    fetchActivities().finally(() => resetShouldUpdate());
  };

  handleShowActivities = () => {
    const { fetchActivities, nextPage } = this.props;

    this.setState({ pending: true });
    this.pendingPromise = makeAbortablePromise(fetchActivities(nextPage));
    this.pendingPromise.promise
      .then(() => this.setState({ pending: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pending: false });
        }
      });
  };

  render() {
    const {
      activities,
      intl: { formatMessage },
      isNextPage
    } = this.props;
    const { pending } = this.state;

    return (
      <div className="activities-list">
        <h2 className="activities-list__heading">
          {formatMessage({
            id: 'activity.title'
          })}
        </h2>
        <div className="activities-list__content">
          {_isEmpty(activities) ? (
            <MessageBox
              message={formatMessage({
                id: 'activity.no-activities'
              })}
              type={MessageType.INFO}
            />
          ) : (
            <ul className="activities-list__list">
              {_map(activities, activity => (
                <li key={activity._id}>
                  <Activity activity={activity} />
                </li>
              ))}
              {isNextPage && (
                <li className="activities-list__buttons">
                  <PendingButton
                    className="link-button"
                    onClick={this.handleShowActivities}
                    type="button"
                  >
                    {formatMessage({
                      id: 'activity.button.view-more-activities'
                    })}
                  </PendingButton>
                </li>
              )}
            </ul>
          )}
          {pending && <Preloader />}
        </div>
      </div>
    );
  }
}

ActivitiesList.propTypes = {
  activities: PropTypes.objectOf(PropTypes.object),
  currentUser: UserPropType.isRequired,
  intl: IntlPropType.isRequired,
  isNextPage: PropTypes.bool.isRequired,
  nextPage: PropTypes.number,
  shouldUpdate: PropTypes.bool,

  fetchActivities: PropTypes.func.isRequired,
  removeActivities: PropTypes.func.isRequired,
  resetShouldUpdate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  activities: getActivities(state),
  currentUser: getCurrentUser(state),
  isNextPage: getIsNextPage(state),
  nextPage: getNextPage(state),
  shouldUpdate: getShouldUpdate(state)
});

export default _flowRight(
  injectIntl,
  connect(
    mapStateToProps,
    { fetchActivities, removeActivities, resetShouldUpdate }
  )
)(ActivitiesList);
