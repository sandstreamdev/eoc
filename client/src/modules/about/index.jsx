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
            <section>
              <h2 className="about__heading">Our story...</h2>
              <p className="about__content">
                Inspiracja do stworzenia aplikacji End of coffee zrodziła się z
                potrzeby zarządzania wyposażeniem naszego biura. W początkowej
                fazie miał to być tylko wewnętrzny projekt szkoleniowy dla
                nowych developerów ale pomysł rozwinął się i kontynuujemy nasze
                prace nad aplikacją. Nasi juniorzy mają okazję do zdobycia
                praktycznego doświadczenia w programowaniu a także w procesie
                biznesowym tworzenia aplikacji. Jednym z naszych załozeń jest
                takze stworzenie projektu, którym nasi developerzy bedą mogli
                pochwalić się w swoim portfolio. Przy pomocy najnowszych
                technologii tworzymy produkt, który jest odpowiedzią na nasze
                potrzeby. Być moze i w Twojej firmie przyda Ci się nasze
                rozwiązanie! Główną funkcjonalnością aplikacji są listy, na
                których możemy umieszczać produkty, których brakuje obecnie w
                firmie. W zależności od roli użytkownika na liście, może on
                dodawać nowe produkty, głosować na nie, odznaczać jako zamówione
                oraz komentować. W ramach aplikacji można tworzyć także kohorty,
                które pomagają organizacji i grupowaniu list. Widoczność list w
                obrębie kohort jest zależna od listy jej członków. Mozliwości
                edycji, archiwizacji czy usuwania zalezy od roli uzytkownika w
                danej liście czy kohorcie. Planujemy takze aby aplikacja ta, w
                przyszlosci stala sie projektem open-source, do którego kazdy
                bedzie mógł dołozyć swoją cegiełke w postaci pomysłu i kodu.
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
