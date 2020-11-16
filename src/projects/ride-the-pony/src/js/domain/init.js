import { handleClick } from '../library/handleClick';
// import { handleInput } from '../library/handleInput';
import { getCookie } from '../library/cookie';

function init() {
  addEventListeners();
  autoFill();
};

function addEventListeners() {
  document.addEventListener('click', handleClick, false);
  // document.addEventListener('input', handleInput, false);
}

function autoFill() {
  // Landing Screen
  const playerName = getCookie('playerName');
  if(playerName) {
    console.log('player name found:', playerName);
    document.querySelector('[data-input="player-name"]').value = playerName;
  }
}

export {
  init
}