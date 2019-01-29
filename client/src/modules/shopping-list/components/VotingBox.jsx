import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ThumbIcon from 'assets/images/thumbs-up-solid.svg';

const VotingBox = ({ voteForProduct, votesCount, whetherUserVoted }) => (
  <button
    className={classNames('voting-box', {
      'voting-box__voted': whetherUserVoted
    })}
    onClick={e => {
      e.stopPropagation();
      voteForProduct();
    }}
    type="button"
  >
    <img alt="Thumb icon" className="voting-box__icon" src={ThumbIcon} />
    {votesCount}
  </button>
);

VotingBox.propTypes = {
  votesCount: PropTypes.number.isRequired,
  whetherUserVoted: PropTypes.bool.isRequired,

  voteForProduct: PropTypes.func.isRequired
};

export default VotingBox;
