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
import Overlay, { OverlayStyleType } from 'common/components/Overlay';

class Toolbar extends PureComponent {
  state = {
    cohortFormVisibility: false,
    formDescription: '',
    formTitle: '',
    overlayVisibility: false,
    shoppingFormVisibility: false,
    userBarMenuVisibility: false
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.clickListener);
    document.removeEventListener('keydown', this.escapeListener);
  }

  addEventListeners = () => {
    document.addEventListener('click', this.clickListener);
    document.addEventListener('keydown', this.escapeListener);
  };

  clickListener = event => {
    const { className } = event.target;
    className.length > 0 && className.includes('overlay')
      ? this.hideOverlayAndForm()
      : null;
  };

  escapeListener = event => {
    event.code === 'Escape' ? this.hideOverlayAndForm() : null;
  };

  hideOverlayAndForm = () => {
    this.setState({
      cohortFormVisibility: false,
      overlayVisibility: false,
      shoppingFormVisibility: false,
      userBarMenuVisibility: false
    });
  };

  handleShoppingListFormVisibility = () => {
    const { shoppingFormVisibility } = this.state;

    this.addEventListeners();
    this.setState({
      cohortFormVisibility: false,
      formDescription: '',
      formTitle: '',
      overlayVisibility: !shoppingFormVisibility,
      shoppingFormVisibility: !shoppingFormVisibility,
      userBarMenuVisibility: false
    });
  };

  handleCohortFormVisibility = () => {
    const { cohortFormVisibility } = this.state;

    this.addEventListeners();
    this.setState({
      cohortFormVisibility: !cohortFormVisibility,
      formDescription: '',
      formTitle: '',
      overlayVisibility: !cohortFormVisibility,
      shoppingFormVisibility: false,
      userBarMenuVisibility: false
    });
  };

  handleShoppingListSubmission = (title, description) => {
    const {
      createShoppingList,
      currentUser: { id }
    } = this.props;
    createShoppingList(title, description, id);
    this.hideOverlayAndForm();
  };

  handleCohortSubmission = (title, description) => {
    const {
      createCohort,
      currentUser: { id }
    } = this.props;
    createCohort(title, description, id);
    this.hideOverlayAndForm();
  };

  handleUserBarMenu = isVisible => {
    this.addEventListeners();
    this.setState({
      cohortFormVisibility: false,
      overlayVisibility: isVisible,
      shoppingFormVisibility: false,
      userBarMenuVisibility: isVisible
    });
  };

  onFormChange = (nodeName, value) => {
    nodeName === 'TEXTAREA'
      ? this.setState({ formDescription: value })
      : this.setState({ formTitle: value });
  };

  render() {
    const {
      cohortFormVisibility,
      formDescription,
      formTitle,
      overlayVisibility,
      shoppingFormVisibility,
      userBarMenuVisibility
    } = this.state;

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
                <div className="toolbar__form">
                  {cohortFormVisibility && (
                    <CreationForm
                      label="Create new cohort"
                      onSubmit={this.handleCohortSubmission}
                      type="menu"
                    />
                  )}
                </div>
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
                <div className="toolbar__form">
                  {shoppingFormVisibility && (
                    <CreationForm
                      label="Create new shopping list"
                      onSubmit={this.handleShoppingListSubmission}
                      type="menu"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="toolbar__logo">
              <AppLogo />
            </div>
            <div className="toolbar__right">
              <UserBar
                isMenuVisible={userBarMenuVisibility}
                onClick={this.handleUserBarMenu}
              />
            </div>
          </div>
        </div>
        {overlayVisibility && <Overlay type={OverlayStyleType.LIGHT} />}
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
