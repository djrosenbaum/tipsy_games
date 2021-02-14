import { app } from '../../app';
import { get } from 'lodash-es';
import { displayScreen } from '../../../library/displayScreen';
import { getActivePlayers } from '../shared/getActivePlayers';
import { setRoomCode } from '../shared/lobby/setRoomCode';

function lobby() {
  console.log('render the lobby');
  setRoomCode();
  updatePlayerList();
  displayScreen('lobby');
}

function updatePlayerList() {
  const players = get(app, 'store.game.players', {});
  let activePlayers = getActivePlayers(players);

  console.log('update player list', activePlayers);

  let markup = Object.keys(activePlayers)
    .map((player) => {
      const { displayName } = activePlayers[player];
      return `<div class="player"><div class="crate"></div><span class="player-name">${displayName}</span></div>`;
    })
    .join('');

  const $playerList = document.querySelector(
    '[data-screen="lobby"] .player-list'
  );
  $playerList.innerHTML = markup;
}

export { lobby };
