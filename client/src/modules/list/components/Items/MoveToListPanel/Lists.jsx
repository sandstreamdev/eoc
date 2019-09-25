import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Preloader from 'common/components/Preloader';
import { IntlPropType } from 'common/constants/propTypes';
import './Lists.scss';

const Lists = ({ intl: { formatMessage }, lists, onClick, pending }) => (
  <div className="lists">
    {pending ? (
      <Preloader />
    ) : (
      <ul>
        {lists.map(list => (
          <li className="lists__ist" key={list._id}>
            <button
              className="lists__button"
              disabled={pending}
              onClick={onClick(list._id, list.name)}
              type="button"
              title={formatMessage(
                {
                  id: 'list.list-item.move-list-button-title'
                },
                { list: list.name }
              )}
            >
              {list.name}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

Lists.propTypes = {
  intl: IntlPropType.isRequired,
  lists: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, name: PropTypes.string })
  ).isRequired,
  pending: PropTypes.bool,

  onClick: PropTypes.func.isRequired
};

export default injectIntl(Lists);
