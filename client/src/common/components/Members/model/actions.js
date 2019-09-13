import { postData } from 'common/utils/fetchMethods';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';

export const inviteUser = email => dispatch =>
  postData('/api/send-invitation', { email })
    .then(() =>
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'common.members.actions.invitation',
        data: { email }
      })
    )
    .catch(err =>
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'common.members.actions.invitation-fail'
        },
        err
      )
    );
