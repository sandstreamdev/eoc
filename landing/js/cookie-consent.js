/* eslint-disable */
$(window).on('load', function() {
  //global variables
  const popupDiv = $('[data-id="popup"]');
  const popupCloseButton = $('[data-id="close-button"]');
  const bodyOverlayDiv = $('[data-id="body-overlay"]');
  const agreeButton = $('[data-id="agree-button"]');

  const cookie = {
    setCookie(name, days) {
      let expires = '';
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = 'expires=' + date.toUTCString();

      document.cookie = `${name}=true; ${expires}`;
    },

    checkIfCookieExist(name) {
      return document.cookie.indexOf(`${name}`) >= 0 ? true : false;
    }
  };

  const bodyOverlay = {
    hideOverlay(bodyOverlayDiv) {
      bodyOverlayDiv.removeClass('body-overlay');
    },

    showOverlay(bodyOverlayDiv) {
      bodyOverlayDiv.addClass('body-overlay');
    }
  };

  const popup = {
    openPopup(popupDiv) {
      popupDiv.css('display', 'block');
    },

    closePopup(popupDiv) {
      popupDiv.css('display', 'none');
    }
  };

  const isCookieSet = cookie.checkIfCookieExist('popup-cookie');
  // app initializtion
  const app = {
    init() {
      if (!isCookieSet) {
        cookie.setCookie('popup-cookie', 30);
        popup.openPopup(popupDiv);
        bodyOverlay.showOverlay(bodyOverlayDiv);
      } else {
        popup.closePopup(popupDiv);
        bodyOverlay.hideOverlay(bodyOverlayDiv);
      }
    }
  };

  // eventListeners
  popupCloseButton.on('click', function() {
    popup.closePopup(popupDiv);
    bodyOverlay.hideOverlay(bodyOverlayDiv);
  });

  agreeButton.on('click', function() {
    popup.closePopup(popupDiv);
    bodyOverlay.hideOverlay(bodyOverlayDiv);
  });

  app.init();
  console.log(cookie.checkIfCookieExist('popup-cookie'));
});

// Algorithm
// 1. Check if cookie is set
// 2. If cookie is not set
//    2.1. Set cookie
//    2.2. Open popup
//    2.3 Open body overlay
// 3. If cookie is set
//    3.1. Close popup
//    3.2 Hide body overlay
