import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import { ThumbIcon } from 'assets/images/icons';
import PendingButton from 'common/components/PendingButton';
import { IntlPropType } from 'common/constants/propTypes';
import './VotingBox.scss';

const VotingBox = ({
  intl: { formatMessage },
  isMember,
  isVoted,
  onVote,
  votesCount
}) => {
  const buttonLabel = formatMessage({
    id: isVoted ? 'list.voting-box.remove' : 'list.voting-box.vote'
  });

  return (
    <PendingButton
      className={classNames('voting-box', {
        'voting-box__voted': isVoted
      })}
      disabled={!isMember}
      onClick={onVote}
      title={buttonLabel}
    >
      <ThumbIcon label={buttonLabel} />
      {votesCount}
    </PendingButton>
  );
};

VotingBox.propTypes = {
  intl: IntlPropType.isRequired,
  isMember: PropTypes.bool.isRequired,
  isVoted: PropTypes.bool.isRequired,
  votesCount: PropTypes.number.isRequired,

  onVote: PropTypes.func.isRequired
};

export default injectIntl(VotingBox);
