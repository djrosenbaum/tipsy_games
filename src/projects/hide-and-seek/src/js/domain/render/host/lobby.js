import { app } from '../../app';
import { get } from 'lodash-es';
import { displayScreen } from '../../../library/displayScreen';

function lobby() {
  console.log('render the lobby');
  setRoomCode();
  // updatePlayerList();
  // updateStartGameButton();
  displayScreen('lobby');
}

function updateStartGameButton() {
  const totalPlayers = Object.keys(playerList).length;
  const startGameButtonWrapper = document.querySelector(
    '[data-screen="lobby"] button[data-action="startGame"]'
  ).parentNode;

  if (totalPlayers < minimumPlayers) {
    startGameButtonWrapper.classList.add('hide');
    return;
  }
  startGameButtonWrapper.classList.remove('hide');
}

function updatePlayerList(playerList) {
  console.log('update player list', playerList);

  let markup = Object.keys(playerList)
    .map((player) => {
      const { playerName } = playerList[player];
      return `<div class="crate-wrapper"><div class="crate reflect"></div><div class="player-name">${playerName}</div></div>`;
    })
    .join('');

  const crates = document.querySelector('[data-screen="lobby"] .crates');
  crates.innerHTML = markup;
}

function setRoomCode() {
  const { channelId } = get(app, 'store.game');
  document.querySelector(
    '[data-screen="lobby"] .room-code'
  ).innerText = channelId;
}

export { lobby };
