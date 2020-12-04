/**
 * gets the value of a cookie
 *
 * @param {string} cookieName - the name of the cookie
 * @returns {string} - the value of the cookie
 */
function getCookie(cookieName) {
  const cookies = decodeURIComponent(document.cookie)
    .split('; ')
    .map((cookie) => cookie.split(/=/))
    .filter((arr) => arr[0] === cookieName);

  return cookies.length ? cookies[0][1] : '';
}

function setCookie(cookieName, cookieValue) {
  try {
    document.cookie = `${cookieName}=${cookieValue}`;
  } catch (error) {
    console.error('tried to cache data in a cookie:', error);
  }
}

export { getCookie, setCookie };
