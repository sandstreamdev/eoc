import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';
import { injectIntl, FormattedMessage } from 'react-intl';

import Textarea from 'common/components/Forms/Textarea';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';
import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';
import { KeyCodes } from 'common/constants/enums';
import { IntlPropType } from 'common/constants/propTypes';

class NewComment extends PureComponent {
  pendingPromise = null;

  constructor(props) {
    super(props);

    this.state = { comment: '', pending: false };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = event => {
    const { code } = event;
    const { onClose } = this.props;

    if (code === KeyCodes.ESCAPE) {
      onClose();
    }
  };

  handleAddComment = () => {
    const { onAddComment, onClose } = this.props;
    const { comment } = this.state;
    const commentToSave = _trim(comment);

    if (!_isEmpty(commentToSave)) {
      this.setState({ pending: true });

      this.pendingPromise = makeAbortablePromise(onAddComment(commentToSave));
      this.pendingPromise.promise
        .then(() => {
          this.setState({ comment: '', pending: false });
          onClose();
        })
        .catch(err => {
          if (!(err instanceof AbortPromiseException)) {
            this.setState({ pending: false });
          }
        });
    }
  };

  handleCommentChange = value => this.setState({ comment: value });

  render() {
    const { comment, pending } = this.state;
    const {
      intl: { formatMessage },
      onBlur,
      onFocus
    } = this.props;

    return (
      <div className="new-comment">
        <div className="new-comment__wrapper">
          <Textarea
            disabled={pending}
            onBlur={onBlur}
            onChange={this.handleCommentChange}
            onFocus={onFocus}
            placeholder={formatMessage({ id: 'common.add-comment' })}
          />
          {comment && (
            <button
              className="primary-button"
              disabled={pending}
              onClick={this.handleAddComment}
              type="button"
            >
              <FormattedMessage id="common.new-comment.save" />
              {pending && (
                <Preloader
                  size={PreloaderSize.SMALL}
                  theme={PreloaderTheme.LIGHT}
                />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
}

NewComment.propTypes = {
  intl: IntlPropType.isRequired,

  onAddComment: PropTypes.func,
  onBlur: PropTypes.func,
  onClose: PropTypes.func,
  onFocus: PropTypes.func
};

export default injectIntl(NewComment);
