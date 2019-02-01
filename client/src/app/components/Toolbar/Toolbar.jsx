import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { COMPANY_PAGE_URL } from 'common/constants/variables';
import CompanyLogo from 'assets/images/company_logo.png';
import {
  ClipboardSolid as ShoppingListIcon,
  HomeSolid as HomeIcon,
  UsersSolid as CohortIcon
} from 'assets/images/icons';
import PlusIcon from 'assets/images/plus-solid.svg';
import UserBar from './components/UserBar';
import AppLogo from 'common/components/AppLogo';
import CreationForm from 'common/components/CreationForm';
import { createNewShoppingList } from 'modules/shopping-list/model/actions';

class Toolbar extends PureComponent {
  state = {
    shoppingFormVisbility: false
  };

  handleShoppingFormVisibilty = () => {
    const { shoppingFormVisbility } = this.state;
    this.setState({ shoppingFormVisbility: !shoppingFormVisbility });
  };

  handleFormSubmission = (title, description) => {
    const { createNewShoppingList } = this.props;

    this.setState({
      shoppingFormVisbility: false
    });
    createNewShoppingList(title, description);
  };

  render() {
    const { shoppingFormVisbility } = this.state;
    return (
      <div className="toolbar">
        <div className="wrapper toolbar__wrapper">
          <div className="toolbar__left">
            <a
              className="toolbar__company-link"
              href={COMPANY_PAGE_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt="Company logo"
                className="toolbar__company-logo"
                src={CompanyLogo}
              />
            </a>
            <div className="toolbar__icon-wrapper">
              <Link className="toolbar__icon-link" to="/dashboard">
                <HomeIcon />
              </Link>
            </div>
            <div className="toolbar__icon-wrapper">
              <a className="toolbar__icon-link" href="#!">
                <CohortIcon />
                <img
                  alt="Plus icon"
                  className="toolbar__icon-plus"
                  src={PlusIcon}
                />
              </a>
            </div>
            <div className="toolbar__icon-wrapper">
              <a
                className="toolbar__icon-link"
                href="#!"
                onClick={this.handleShoppingFormVisibilty}
              >
                <ShoppingListIcon />
                <img
                  alt="Plus Icon"
                  className="toolbar__icon-plus"
                  src={PlusIcon}
                />
              </a>
              <div
                className={classNames('toolbar__form', {
                  hidden: !shoppingFormVisbility
                })}
              >
                <CreationForm
                  label="Create new shopping list"
                  onSubmit={this.handleFormSubmission}
                />
              </div>
            </div>
          </div>
          <div className="toolbar__logo">
            <AppLogo />
          </div>
          <div className="toolbar__right">
            <UserBar />
          </div>
        </div>
      </div>
    );
  }
}

Toolbar.propTypes = {
  createNewShoppingList: PropTypes.func.isRequired
};

export default connect(
  null,
  { createNewShoppingList }
)(Toolbar);
