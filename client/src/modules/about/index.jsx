import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

import { IntlPropType } from 'common/constants/propTypes';
import './About.scss';

const About = ({ intl: { formatMessage } }) => (
  <div className="about">
    <div className="about__intro">
      <div className="wrapper">
        <h1 className="about__intro-heading">
          <FormattedMessage
            id="about.intro-heading"
            values={{ appName: formatMessage({ id: 'common.app-name' }) }}
          />
        </h1>
        <h2 className="about__subheading">
          <FormattedMessage
            id="about.intro-subheading"
            values={{ appName: formatMessage({ id: 'common.app-name' }) }}
          />
        </h2>
      </div>
    </div>
    <div className="about__main">
      <div className="wrapper">
        <article className="about__article">
          <h2 className="about__heading">
            <FormattedMessage id="about.heading" />
          </h2>
          <section className="about__section">
            <p className="about__content">
              <FormattedMessage
                id="about.content-1"
                values={{ appName: formatMessage({ id: 'common.app-name' }) }}
              />
            </p>
            <p className="about__content">
              <FormattedMessage id="about.content-2" />
            </p>
          </section>
        </article>
      </div>
    </div>
    <div className="about__cta">
      <h2 className="about__cta-heading">
        <FormattedMessage
          id="about.try-cta"
          values={{ appName: formatMessage({ id: 'common.app-name' }) }}
        />
      </h2>
      <Link className="about__button-link" to="/dashboard">
        <button className="about__cta-button primary-button" type="button">
          <FormattedMessage id="about.cta-button" />
        </button>
      </Link>
    </div>
  </div>
);

About.propTypes = {
  intl: IntlPropType.isRequired
};

export default injectIntl(About);
