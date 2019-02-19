import React, { PureComponent, Fragment } from 'react';
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
import { createShoppingList } from 'modules/shopping-list/model/actions';
import { createCohort } from 'modules/cohort/model/actions';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';

class Toolbar extends PureComponent {
  state = {
    cohortFormVisibility: false,
    shoppingFormVisibility: false
  };

  hideForms = () => {
    this.setState({
      cohortFormVisibility: false,
      shoppingFormVisibility: false
    });
  };

  handleShoppingListFormVisibility = () => {
    const { shoppingFormVisibility } = this.state;

    this.setState({
      cohortFormVisibility: false,
      shoppingFormVisibility: !shoppingFormVisibility
    });
  };

  handleCohortFormVisibility = () => {
    const { cohortFormVisibility } = this.state;

    this.setState({
      cohortFormVisibility: !cohortFormVisibility,
      shoppingFormVisibility: false
    });
  };

  handleShoppingListSubmission = (title, description) => {
    const {
      createShoppingList,
      currentUser: { id }
    } = this.props;
    createShoppingList(title, description, id);
    this.hideForms();
  };

  handleCohortSubmission = (title, description) => {
    const {
      createCohort,
      currentUser: { id }
    } = this.props;
    createCohort(title, description, id);
    this.hideForms();
  };

  render() {
    const { cohortFormVisibility, shoppingFormVisibility } = this.state;

    return (
      <Fragment>
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
              <div
                className={classNames('toolbar__icon-wrapper', {
                  'z-index-high': cohortFormVisibility
                })}
              >
                <button
                  className="toolbar__icon-link"
                  onClick={this.handleCohortFormVisibility}
                  type="button"
                >
                  <CohortIcon />
                  <img
                    alt="Plus icon"
                    className="toolbar__icon-plus"
                    src={PlusIcon}
                  />
                </button>
                {cohortFormVisibility && (
                  <div className="toolbar__form">
                    <CreationForm
                      label="Create new cohort"
                      onSubmit={this.handleCohortSubmission}
                      type="menu"
                      onFormHide={this.hideForms}
                    />
                  </div>
                )}
              </div>
              <div
                className={classNames('toolbar__icon-wrapper', {
                  'z-index-high': shoppingFormVisibility
                })}
              >
                <button
                  className="toolbar__icon-link"
                  onClick={this.handleShoppingListFormVisibility}
                  type="button"
                >
                  <ShoppingListIcon />
                  <img
                    alt="Plus Icon"
                    className="toolbar__icon-plus"
                    src={PlusIcon}
                  />
                </button>
                {shoppingFormVisibility && (
                  <div className="toolbar__form">
                    <CreationForm
                      label="Create new shopping list"
                      onSubmit={this.handleShoppingListSubmission}
                      type="menu"
                      onFormHide={this.hideForms}
                    />
                  </div>
                )}
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
      </Fragment>
    );
  }
}

Toolbar.propTypes = {
  currentUser: UserPropType.isRequired,

  createCohort: PropTypes.func.isRequired,
  createShoppingList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  { createCohort, createShoppingList }
)(Toolbar);
