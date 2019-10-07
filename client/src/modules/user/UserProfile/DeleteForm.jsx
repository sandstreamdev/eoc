import React from 'react';
import { FormattedMessage } from 'react-intl';

import './DeleteForm.scss';

const DeleteForm = () => {
  return (
    <form className="delete-form">
      <label className="delete-form__label">
        <FormattedMessage id="delete-form.email" />
        <input
          autoComplete="off"
          className="delete-form__input primary-input"
          type="email"
        />
      </label>
      <label className="delete-form__label">
        <FormattedMessage
          id="delete-form.verify-message"
          values={{ string: <em>Dupa kupa</em> }}
        />
        <input
          autoComplete="off"
          className="delete-form__input primary-input"
          type="text"
        />
      </label>
      <label className="delete-form__label">
        <FormattedMessage id="user.auth.input.password.confirm" />
        <input
          autoComplete="off"
          className="delete-form__input primary-input"
          type="password"
        />
      </label>
    </form>
  );
};

export default DeleteForm;
