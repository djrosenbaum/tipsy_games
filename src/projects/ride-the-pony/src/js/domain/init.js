import { EventListener } from './class/event-listener';
import { app } from './app';
import { getCookie } from '../library/cookie';

function init() {
  app.eventListener = new EventListener();

  // Landing Screen
  const playerName = getCookie('playerName');
  if(playerName) {
    console.log('player name found:', playerName);
    document.querySelector('[data-input="player-name"]').value = playerName;
  }
};

export {
  init
}