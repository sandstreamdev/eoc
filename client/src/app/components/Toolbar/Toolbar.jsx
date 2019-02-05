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
import { createShoppingList } from 'modules/shopping-list/model/actions';
import { createCohort } from 'modules/cohort/model/actions';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';

class Toolbar extends PureComponent {
  state = {
    cohortFormVisbility: false,
    shoppingFormVisbility: false
  };

  handleShoppingListFormVisibility = () => {
    const { shoppingFormVisbility } = this.state;
    this.setState({
      shoppingFormVisbility: !shoppingFormVisbility,
      cohortFormVisbility: false
    });
  };

  handleCohortFormVisibility = () => {
    const { cohortFormVisbility } = this.state;

    this.setState({
      shoppingFormVisbility: false,
      cohortFormVisbility: !cohortFormVisbility
    });
  };

  handleShoppingListSubmission = (title, description) => {
    const {
      createShoppingList,
      currentUser: { id }
    } = this.props;
    createShoppingList(title, description, id);
    this.setState({ shoppingFormVisbility: false });
  };

  handleCohortSubmission = (title, description) => {
    const {
      createCohort,
      currentUser: { id }
    } = this.props;
    createCohort(title, description, id);
    this.setState({ cohortFormVisbility: false });
  };

  render() {
    const { shoppingFormVisbility, cohortFormVisbility } = this.state;
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
              <a
                className="toolbar__icon-link"
                href="#!"
                onClick={this.handleCohortFormVisibility}
              >
                <CohortIcon />
                <img
                  alt="Plus icon"
                  className="toolbar__icon-plus"
                  src={PlusIcon}
                />
              </a>
              <div
                className={classNames('toolbar__form', {
                  hidden: !cohortFormVisbility
                })}
              >
                <CreationForm
                  label="Create new cohort"
                  onSubmit={this.handleCohortSubmission}
                />
              </div>
            </div>
            <div className="toolbar__icon-wrapper">
              <a
                className="toolbar__icon-link"
                href="#!"
                onClick={this.handleShoppingListFormVisibility}
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
                  onSubmit={this.handleShoppingListSubmission}
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
