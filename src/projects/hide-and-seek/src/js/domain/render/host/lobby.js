import { app } from '../../app';
import { get } from 'lodash-es';
import { displayScreen } from '../../../library/displayScreen';
import { getActivePlayers } from '../shared/getActivePlayers';
import { setRoomCode } from '../shared/lobby/setRoomCode';

function lobby() {
  console.log('render the lobby');
  setRoomCode();
  updatePlayerList();
  updateStartGameButton();
  displayScreen('lobby');
}

function updateStartGameButton() {
  const players = get(app, 'store.game.players', {});
  const minimumPlayers = get(app, 'store.game.minimumPlayers');
  const totalPlayers = Object.keys(players).length;
  const startGameButtonWrapper = document.querySelector(
    '[data-screen="lobby"] button[data-action="startGame"]'
  ).parentNode;

  if (totalPlayers < minimumPlayers) {
    startGameButtonWrapper.classList.add('hide');
    return;
  }
  startGameButtonWrapper.classList.remove('hide');
}

function updatePlayerList() {
  const players = get(app, 'store.game.players', {});
  let activePlayers = getActivePlayers(players);

  let markup = Object.keys(activePlayers)
    .map((player) => {
      const { displayName } = activePlayers[player];
      return `<div class="crate-wrapper"><div class="crate reflect"></div><div class="player-name">${displayName}</div></div>`;
    })
    .join('');

  const crates = document.querySelector('[data-screen="lobby"] .crates');
  crates.innerHTML = markup;
}

export { lobby };
