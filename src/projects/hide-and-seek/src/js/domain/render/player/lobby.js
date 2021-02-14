import { app } from '../../app';
import { get } from 'lodash-es';
import { displayScreen } from '../../../library/displayScreen';

function lobby() {
  console.log('render the lobby');
  setRoomCode();
  updatePlayerList();
  displayScreen('lobby');
}

function updatePlayerList() {
  const players = get(app, 'store.game.players', {});
  console.log('update player list', players);

  let markup = Object.keys(players)
    .map((player) => {
      const { displayName } = players[player];
      return `<div class="player"><div class="crate"></div><span class="player-name">${displayName}</span></div>`;
    })
    .join('');

  const $playerList = document.querySelector(
    '[data-screen="lobby"] .player-list'
  );
  $playerList.innerHTML = markup;
}

function setRoomCode() {
  const { channelId } = get(app, 'store.game');
  document.querySelector(
    '[data-screen="lobby"] .room-code'
  ).innerText = channelId;
}

export { lobby };
