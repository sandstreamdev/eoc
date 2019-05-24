import { patchData } from 'common/utils/fetchMethods';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';

export const inviteUser = email => dispatch =>
  patchData('/api/send-invitation', { email })
    .then(() =>
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Invitation email to: ${email} successfully sent.`
      )
    )
    .catch(() =>
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        'Something went wrong while sending invitation email. Please try again'
      )
    );
