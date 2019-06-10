import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const About = () => (
  <div className="about">
    <div className="about__intro">
      <div className="wrapper">
        <h1 className="about__intro-heading">
          <FormattedMessage id="about.intro-heading" />
        </h1>
        <h2 className="about__subheading">
          <FormattedMessage id="about.intro-subheading" />
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
              <FormattedMessage id="about.content-1" />
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
        <FormattedMessage id="about.try-cta" />
      </h2>
      <Link to="/dashboard">
        <button className="about__cta-button primary-button" type="button">
          <FormattedMessage id="about.cta-button" />
        </button>
      </Link>
    </div>
  </div>
);

export default About;
