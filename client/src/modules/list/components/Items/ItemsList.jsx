import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import ListItem from 'modules/list/components/Items/ListItem';
import ListArchivedItem from 'modules/list/components/Items/ListArchivedItem';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';

const DISPLAY_LIMIT = 3;

class ItemsList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      limit: DISPLAY_LIMIT
    };
  }

  showMore = event => {
    event.preventDefault();

    this.setState(({ limit }) => ({ limit: limit + DISPLAY_LIMIT }));
  };

  showLess = event => {
    event.preventDefault();

    this.setState({ limit: DISPLAY_LIMIT });
  };

  renderItems = () => {
    const { archived, isMember, items } = this.props;
    const { limit } = this.state;

    if (!items) {
      return null;
    }

    return archived ? (
      <ul className="items-list">
        <TransitionGroup component={null}>
          {items.slice(0, limit).map(item => (
            <CSSTransition
              classNames="animated-item"
              key={item._id}
              timeout={1000}
            >
              <ListArchivedItem
                data={item}
                isMember={isMember}
                key={item._id}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ul>
    ) : (
      <ul className="items-list">
        <TransitionGroup component={null}>
          {items.slice(0, limit).map(item => (
            <CSSTransition
              classNames="animated-item"
              key={item._id}
              timeout={2000}
            >
              <ListItem data={item} isMember={isMember} key={item._id} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ul>
    );
  };

  render() {
    const { archived, items } = this.props;
    const { limit } = this.state;
    const messageId = archived
      ? 'list.items-list.message-no-arch-items'
      : 'list.items-list.message-no-items';

    return (
      <Fragment>
        {!items.length && (
          <MessageBox type={MessageType.INFO}>
            <FormattedMessage id={messageId} />
          </MessageBox>
        )}
        {this.renderItems()}
        {limit < items.length && (
          <button
            className="items__show-more"
            onClick={this.showMore}
            type="button"
          />
        )}
        {limit > DISPLAY_LIMIT && (
          <button
            className="items__show-less"
            onClick={this.showLess}
            type="button"
          />
        )}
      </Fragment>
    );
  }
}

ItemsList.propTypes = {
  archived: PropTypes.bool,
  isMember: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object)
};

export default withRouter(ItemsList);
