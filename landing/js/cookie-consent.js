/* eslint-disable */
$(window).on('load', function() {
  const cookieBar = $('[data-id="cookie-bar"]');
  const bodyOverlayDiv = $('[data-id="body-overlay"]');
  const cookieButton = $('[data-id="cookie-button"]');
  const body = $('body');

  const cookie = {
    set: (name, days) => {
      let expires = '';
      const date = new Date();

      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = 'expires=' + date.toUTCString();
      document.cookie = `${name}=true; ${expires}`;
    },

    checkIfSet: name => {
      return document.cookie.indexOf(`${name}`) >= 0 ? true : false;
    }
  };

  const bodyOverlay = {
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

  const isCookieSet = cookie.checkIfSet('cookie-consent');

  const module = {
    init: () => {
      if (!isCookieSet) {
        cookieMessage.open();
        bodyOverlay.showOverlay();
      } else {
        cookieMessage.close();
        bodyOverlay.hideOverlay();
      }
    }
  };

  cookieButton.on('click', function() {
    cookieMessage.close();
    bodyOverlay.hideOverlay();
    cookie.set('cookie-consent', 30);
  });

  module.init();
});
