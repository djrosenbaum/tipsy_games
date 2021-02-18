import { displayScreen } from '../../../library/displayScreen';
import { getActivePlayers } from '../shared/getActivePlayers';
import { renderRoomCode } from '../shared/lobby/renderRoomCode';

function lobby() {
  console.log('render the lobby');
  renderRoomCode();
  renderPlayerList();
  displayScreen('lobby');
}

function renderPlayerList() {
  let activePlayers = getActivePlayers();
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
