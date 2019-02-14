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
import Overlay from 'common/components/Overlay';

class Toolbar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cohortFormVisbility: false,
      shoppingFormVisbility: false,
      overlayVisibility: false
    };
  }

  componentDidMount() {
    document.addEventListener('click', event => {
      event.target.className === 'overlay' ? this.hideOverlayAndForm() : null;
    });
    document.addEventListener('keydown', event => {
      event.code === 'Escape' ? this.hideOverlayAndForm() : null;
    });
  }

  /**
   * TODO Przerobić dodawania listenerów i usuwać listenery zanim component się odmontuje
   */

  hideOverlayAndForm = () => {
    this.setState({
      overlayVisibility: false,
      cohortFormVisbility: false,
      shoppingFormVisbility: false
    });
  };

  handleShoppingListFormVisibility = () => {
    const { shoppingFormVisbility, overlayVisibility } = this.state;

    this.setState({
      shoppingFormVisbility: !shoppingFormVisbility,
      cohortFormVisbility: false,
      overlayVisibility: !overlayVisibility
    });
  };

  handleCohortFormVisibility = () => {
    const { cohortFormVisbility, overlayVisibility } = this.state;

    this.setState({
      shoppingFormVisbility: false,
      cohortFormVisbility: !cohortFormVisbility,
      overlayVisibility: !overlayVisibility
    });
  };

  handleShoppingListSubmission = (title, description) => {
    const {
      createShoppingList,
      currentUser: { id }
    } = this.props;
    createShoppingList(title, description, id);
    this.setState({ shoppingFormVisbility: false, overlayVisibility: false });
  };

  handleCohortSubmission = (title, description) => {
    const {
      createCohort,
      currentUser: { id }
    } = this.props;
    createCohort(title, description, id);
    this.setState({ cohortFormVisbility: false, overlayVisibility: false });
  };

  render() {
    const {
      shoppingFormVisbility,
      cohortFormVisbility,
      overlayVisibility
    } = this.state;

    const styles = {
      cohortWrapperFormStyles: classNames('toolbar__icon-wrapper', {
        'z-index-high': cohortFormVisbility
      }),
      cohortFormLinkStyles: classNames('toolbar__icon-link', {
        'toolbar__icon-link--active': cohortFormVisbility
      }),
      listWrapperFormStyles: classNames('toolbar__icon-wrapper', {
        'z-index-high': shoppingFormVisbility
      }),
      listFormLinkStyles: classNames('toolbar__icon-link', {
        'toolbar__icon-link--active': shoppingFormVisbility
      })
    };

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
              <div className={styles.cohortWrapperFormStyles}>
                <a
                  className={styles.cohortFormLinkStyles}
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
                    type="menu"
                  />
                </div>
              </div>
              <div className={styles.listWrapperFormStyles}>
                <a
                  className={styles.listFormLinkStyles}
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
                    type="menu"
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
        {overlayVisibility && <Overlay />}
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
