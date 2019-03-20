/* eslint-disable */
$(window).on('load', () => {
  const cookieBar = $('[data-id="cookie-bar"]');
  const cookieButton = $('[data-id="cookie-button"]');
  const body = $('body');

  const cookie = {
    set: (name, days) => {
      let expires;
      const date = new Date();

      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=true; ${expires}`;
    },
    checkIfSet: name => {
      return document.cookie.indexOf(`${name}`) >= 0 ? true : false;
    }
  };

  const bodyElement = {
    hideOverlay: () => {
      body.removeClass('body-overlay');
    },
    showOverlay: () => {
      body.addClass('body-overlay');
    }
  };

  const cookieMessage = {
    open: () => {
      cookieBar.removeClass('hidden');
    },
    close: () => {
      cookieBar.addClass('hidden');
    }
  };

  const module = {
    init: () => {
      if (!cookie.checkIfSet('cookie-consent')) {
        cookieMessage.open();
        bodyElement.showOverlay();
        return;
      }
      cookieMessage.close();
      bodyElement.hideOverlay();
    }
  };

  cookieButton.on('click', function() {
    cookieMessage.close();
    bodyElement.hideOverlay();
    cookie.set('cookie-consent', 365);
  });

  module.init();
});
