import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Toolbar from 'common/components/Toolbar';

const About = () => (
  <Fragment>
    <Toolbar />

    <div className="about">
      <div className="about__intro">
        <div className="wrapper">
          <h1 className="about__intro-heading">
            End of coffee
            <br />
            Office inventory tracking app
          </h1>
          <h2 className="about__subheading">
            End of coffee helps you track all the office inventory you need!
          </h2>
        </div>
      </div>
      <div className="about__main">
        <div className="wrapper">
          <article className="about__article">
            <h2 className="about__heading">App history</h2>
            <section className="about__section">
              <p className="about__content">
                Inspiration to create the End of coffee application was born out
                of the need to manage our office equipment. In the initial
                phase, it was to be only an internal training project for new
                employees. By participating in the project, developers were free
                to choose technology and tools. The End Of Coffee application
                can also be an interesting point in the portfolio of every
                employee who participated in the process of creating this
                product.
              </p>
              <p className="about__content">
                The main functionality of the application are the lists on which
                we can place products that are currently missing in the company.
                Depending on the role of the user on the list, he can add new
                products, vote for them, mark them as ordered and comment. As
                part of the application, you can also create cohorts that can
                help you organize and group your lists. The visibility of lists
                within a cohort depends on the list of members of a given team.
                In the future, we plan to make the application an open-source
                project and anyone who wants to contribute to the project.
              </p>
            </section>
          </article>
        </div>
      </div>
      <div className="about__cta">
        <h2 className="about__cta-heading">Try End of coffee app today!</h2>
        <Link to="/dashboard">
          <button className="about__cta-button primary-button" type="button">
            Go to app
          </button>
        </Link>
      </div>
    </div>
  </Fragment>
);

export default About;
