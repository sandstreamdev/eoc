import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DeleteAccount.scss';

class DeleteAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <section className="delete-account">
        <h2 className="delete-account__heading">Delete Account</h2>
        <ul className="delete-account__list">
          <li className="delete-account__list-item">
            Delete account
            <button className="danger-button" type="button">
              Delete account
            </button>
          </li>
        </ul>
      </section>
    );
  }
}

export default DeleteAccount;
