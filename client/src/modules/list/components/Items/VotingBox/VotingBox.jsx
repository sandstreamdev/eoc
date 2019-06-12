import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import { ThumbIcon } from 'assets/images/icons';
import PendingButton from 'common/components/PendingButton';
import { IntlPropType } from 'common/constants/propTypes';

const VotingBox = ({
  intl: { formatMessage },
  isMember,
  isVoted,
  onVote,
  votesCount
}) => (
  <PendingButton
    className={classNames('voting-box', {
      'voting-box__voted': isVoted
    })}
    disabled={!isMember}
    onClick={onVote}
    title={
      isVoted
        ? formatMessage({ id: 'list.voting-box.remove' })
        : formatMessage({ id: 'list.voting-box.vote' })
    }
  >
    <ThumbIcon />
    {votesCount}
  </PendingButton>
);

VotingBox.propTypes = {
  intl: IntlPropType.isRequired,
  isMember: PropTypes.bool.isRequired,
  isVoted: PropTypes.bool.isRequired,
  votesCount: PropTypes.number.isRequired,

  onVote: PropTypes.func.isRequired
};

export default injectIntl(VotingBox);
