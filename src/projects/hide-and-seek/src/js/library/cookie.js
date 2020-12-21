// Cookie Helper Functions
// https://javascript.info/cookie

/**
 * gets the value of a cookie
 *
 * @param {string} name - the name of the cookie
 * @returns {string|undefined} - the value of the cookie or undefined
 */
function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

/**
 * sets the value of a cookie
 *
 * @param {string} name - the name of the cookie
 * @param {string} value - the value of the cookie
 * @param {Object} options - some cookie options
 * @returns {string} - the value of the cookie
 */
function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    // add other defaults here if necessary
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie =
    encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += '; ' + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

/**
 * deletes a cookie
 *
 * @param {string} name - name of the cookie to delete
 * @returns {undefined} undefined
 */
function deleteCookie(name) {
  setCookie(name, '', {
    'max-age': -1,
  });
}

// Example of use:
// setCookie('user', 'John', {secure: true, 'max-age': 3600});

export { deleteCookie, getCookie, setCookie };
