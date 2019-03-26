import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ThumbIcon from 'assets/images/thumbs-up-solid.svg';

const VotingBox = ({ voteForItem, votesCount, isVoted }) => (
  <button
    className={classNames('voting-box', {
      'voting-box__voted': isVoted
    })}
    onClick={e => {
      e.stopPropagation();
      voteForItem();
    }}
    type="button"
  >
    <img
      alt={`${isVoted ? 'remove your vote' : 'vote'}`}
      className="voting-box__icon"
      src={ThumbIcon}
    />
    {votesCount}
  </button>
);

VotingBox.propTypes = {
  votesCount: PropTypes.number.isRequired,
  isVoted: PropTypes.bool.isRequired,

  voteForItem: PropTypes.func.isRequired
};

export default VotingBox;
