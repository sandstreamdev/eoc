import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ThumbIcon from 'assets/images/thumbs-up-solid.svg';

const VotingBox = ({ isVoted, voteForItem, votesCount }) => (
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
    <img alt="Thumb icon" className="voting-box__icon" src={ThumbIcon} />
    {votesCount}
  </button>
);

VotingBox.propTypes = {
  isVoted: PropTypes.bool.isRequired,
  votesCount: PropTypes.number.isRequired,

  voteForItem: PropTypes.func.isRequired
};

export default VotingBox;
