import React, { Fragment } from 'react';

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
            <section>
              <h2 className="about__heading">Our story...</h2>
              <p className="about__content">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Accusamus harum facilis id libero? Iusto, atque cumque suscipit
                molestiae odio fugit autem aliquid sequi explicabo ullam eaque
                debitis, quia minima culpa. Lorem ipsum dolor sit amet,
                consectetur adipisicing elit. Accusamus harum facilis id libero?
                Iusto, atque cumque suscipit molestiae odio fugit autem aliquid
                sequi explicabo ullam eaque debitis, quia minima culpa. Lorem
                ipsum dolor sit amet, consectetur adipisicing elit. Accusamus
                harum facilis id libero? Iusto, atque cumque suscipit molestiae
                odio fugit autem aliquid sequi explicabo ullam eaque debitis,
                quia minima culpa. Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Accusamus harum facilis id libero? Iusto,
                atque cumque suscipit molestiae odio fugit autem aliquid sequi
                explicabo ullam eaque debitis, quia minima culpa. Lorem ipsum
                dolor sit amet, consectetur adipisicing elit. Accusamus harum
                facilis id libero? Iusto, atque cumque suscipit molestiae odio
                fugit autem aliquid sequi explicabo ullam eaque debitis, quia
                minima culpa. Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Accusamus harum facilis id libero? Iusto,
                atque cumque suscipit molestiae odio fugit autem aliquid sequi
                explicabo ullam eaque debitis, quia minima culpa. Lorem ipsum
                dolor sit amet, consectetur adipisicing elit. Accusamus harum
                facilis id libero? Iusto, atque cumque suscipit molestiae odio
                fugit autem aliquid sequi explicabo ullam eaque debitis, quia
                minima culpa. Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Accusamus harum facilis id libero? Iusto,
                atque cumque suscipit molestiae odio fugit autem aliquid sequi
                explicabo ullam eaque debitis, quia minima culpa.
              </p>
            </section>
          </article>
        </div>
      </div>
      <div className="about__cta">
        <h2 className="about__cta-heading">Try End of coffee app today!</h2>
        <button className="about__cta-button primary-button" type="button">
          Go to app
        </button>
      </div>
    </div>
  </Fragment>
);

export default About;
