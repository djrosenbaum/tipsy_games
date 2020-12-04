import { getCookie } from '../library/cookie';
import { log } from '../library/log';

/**
 * Autofills the player name input box if stored in a playerName cookie
 *
 * @returns {undefined} undefined
 */
export const autofill = () => {
  log('auto fill');
  // Landing Screen
  const playerName = getCookie('playerName');
  if (playerName) {
    document.querySelector('[data-input="player-name"]').value = playerName;
  }
};
